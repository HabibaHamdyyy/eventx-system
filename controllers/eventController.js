import Event from "../models/Event.js";

// Add Event
export const addEvent = async (req, res) => {
  try {
    console.log("Received event data:", req.body);
    console.log("User making request:", req.user);
    
    const newEvent = new Event(req.body);
    console.log("Created event object:", newEvent);
    
    await newEvent.save();
    console.log("Event saved successfully:", newEvent);
    
    res.status(201).json(newEvent);
  } catch (error) {
    console.error("Error adding event:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// Get All Events
export const getEvents = async (req, res) => {
  try {
    console.log('getEvents called');
    const events = await Event.find();
    console.log('Found events:', events.length);
    res.json(events);
  } catch (err) {
    console.error('Error getting events:', err);
    res.status(500).json({ message: err.message });
  }
};

// Get single event by ID
export const getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }
    res.json(event);
  } catch (error) {
    console.error("Error fetching event:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// Update Event
export const updateEvent = async (req, res) => {
  try {
    const event = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(event);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete Event
export const deleteEvent = async (req, res) => {
  try {
    const eventId = req.params.id;
    
    await Event.findByIdAndDelete(eventId);
    
    // Clean up associated tickets
    try {
      const { cleanupTicketsForEvent } = await import("../controllers/ticketController.js");
      await cleanupTicketsForEvent(eventId);
    } catch (cleanupError) {
      console.error('Error cleaning up tickets:', cleanupError);
      // Don't fail the delete operation if cleanup fails
    }
    
    res.json({ message: "Event deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
