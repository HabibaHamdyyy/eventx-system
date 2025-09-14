import Ticket from "../models/Ticket.js";
import Event from "../models/Event.js";
import QRCode from "qrcode";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import mongoose from "mongoose";

// Book a ticket
export const bookTicket = async (req, res) => {
  try {
    const userId = req.user.id; 
    const eventId = req.body.eventId;
    const { seatNumber } = req.body;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found." });

    // Find the event
    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ message: "Event not found" });

    if (event.availableSeats <= 0)
      return res.status(400).json({ message: "No available seats" });

    // Check if the specific seat is already booked
    const existingTicket = await Ticket.findOne({ eventId, seatNumber });
    if (existingTicket) {
      return res.status(400).json({ message: `Seat ${seatNumber} is already booked` });
    }

    // Generate QR code as data URL
    const qrData = `Ticket for ${event.title}, Seat ${seatNumber}, User ${userId}`;
    const qrCode = await QRCode.toDataURL(qrData);

    // Create ticket
    const ticket = new Ticket({
      userId: userId,
      eventId: eventId,
      seatNumber,
      qrCode,
    });
    await ticket.save();

    // Decrease available seats
    event.availableSeats -= 1;
    await event.save();

    res.status(201).json({ message: "Ticket booked successfully!", ticket });
  } catch (err) {
    console.error("Error booking ticket:", err);
    res.status(500).json({ message: "Error booking ticket", error: err.message });
  }
};

// Get most booked events for analytics
export const getMostBookedEvents = async (req, res) => {
  try {
    // Aggregate tickets to count bookings per event
    const mostBookedEvents = await Ticket.aggregate([
      // Group by eventId and count tickets
      { $group: {
        _id: "$eventId",
        count: { $sum: 1 },
      }},
      // Sort by count in descending order
      { $sort: { count: -1 }},
      // Limit to top 5 events
      { $limit: 5 },
      // Lookup event details
      { $lookup: {
        from: "events",
        localField: "_id",
        foreignField: "_id",
        as: "eventDetails"
      }},
      // Unwind the eventDetails array
      { $unwind: "$eventDetails" },
      // Project only needed fields
      { $project: {
        _id: 0,
        eventId: "$_id",
        title: "$eventDetails.title",
        bookingCount: "$count",
        date: "$eventDetails.date",
        venue: "$eventDetails.venue",
        price: "$eventDetails.price",
        image: "$eventDetails.image"
      }}
    ]);

    res.json(mostBookedEvents);
  } catch (err) {
    console.error("Error getting most booked events:", err);
    res.status(500).json({ error: "Server error" });
  }
};

export const getTicketsByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const tickets = await Ticket.find({ userId }).populate("eventId");
    
    // Filter out tickets with deleted events
    const validTickets = tickets.filter(ticket => {
      if (!ticket.eventId || !ticket.eventId._id) {
        return false;
      }
      
      if (!ticket.eventId.title || !ticket.eventId.date) {
        return false;
      }
      
      return true;
    });
    
    res.json(validTickets);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

export const getAllTickets = async (req, res) => {
  try {
    const tickets = await Ticket.find().populate("userId").populate("eventId");
    
    // Filter out tickets with deleted events
    const validTickets = tickets.filter(ticket => {
      if (!ticket.eventId || !ticket.eventId._id) {
        return false;
      }
      
      if (!ticket.eventId.title || !ticket.eventId.date) {
        return false;
      }
      
      return true;
    });
    
    res.json(validTickets);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

// Clean up tickets when an event is deleted
export const cleanupTicketsForEvent = async (eventId) => {
  try {
    console.log('Cleaning up tickets for deleted event:', eventId);
    const result = await Ticket.deleteMany({ eventId });
    console.log('Deleted tickets:', result.deletedCount);
    return result.deletedCount;
  } catch (err) {
    console.error('Error cleaning up tickets:', err);
    throw err;
  }
};

// Get booked seats for an event
export const getBookedSeatsForEvent = async (req, res) => {
  try {
    const { eventId } = req.params;
    
    // Find all tickets for this event
    const tickets = await Ticket.find({ eventId });
    
    // Extract just the seat numbers
    const bookedSeats = tickets.map(ticket => ticket.seatNumber);
    
    res.json(bookedSeats);
  } catch (err) {
    console.error("Error getting booked seats:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// Get current user's tickets
export const getMyTickets = async (req, res) => {
  try {
    console.log('getMyTickets called with user:', req.user);
    const userId = req.user.id; // from token
    console.log('Looking for tickets with userId:', userId);
    
    // Get tickets and populate event details
    const tickets = await Ticket.find({ userId }).populate("eventId");
    console.log('Found tickets:', tickets);
    
    // Filter out tickets with deleted events and add validation
    const validTickets = tickets.filter(ticket => {
      // Check if event exists and has required fields
      if (!ticket.eventId || !ticket.eventId._id) {
        console.log('Ticket has no event:', ticket._id);
        return false;
      }
      
      // Check if event has required fields
      if (!ticket.eventId.title || !ticket.eventId.date) {
        console.log('Event missing required fields:', ticket.eventId._id);
        return false;
      }
      
      return true;
    });
    
    console.log('Valid tickets after filtering:', validTickets.length);
    
    res.json(validTickets);
  } catch (err) {
    console.error("Error getting user tickets:", err);
    res.status(500).json({ error: "Server error" });
  }
};
