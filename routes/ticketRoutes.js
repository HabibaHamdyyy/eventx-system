import express from "express";
import { bookTicket, getTicketsByUser, getAllTickets, getMyTickets, getBookedSeatsForEvent, getMostBookedEvents } from "../controllers/ticketController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { roleMiddleware } from "../middlewares/roleMiddleware.js";

const router = express.Router();

// User can book tickets
router.post("/book", authMiddleware, bookTicket);

// User can see their tickets
router.get("/user/:userId", authMiddleware, getTicketsByUser);

// User can see their own tickets (current user)
router.get("/my-tickets", authMiddleware, getMyTickets);

// Admin can see all tickets
router.get("/admin/all", authMiddleware, roleMiddleware("Admin"), getAllTickets);

// Get booked seats for an event
router.get("/event/:eventId/booked-seats", getBookedSeatsForEvent);

// Get most booked events for analytics
router.get("/analytics/most-booked", authMiddleware, getMostBookedEvents);

export default router;
