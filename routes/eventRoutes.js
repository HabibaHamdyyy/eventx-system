import express from "express";
import { addEvent, getEvents, getEventById, updateEvent, deleteEvent } from "../controllers/eventController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { roleMiddleware } from "../middlewares/roleMiddleware.js";

const router = express.Router();

// Public routes
router.get("/", getEvents);
router.get("/:id", getEventById);

// Admin-only routes
router.post("/", authMiddleware, roleMiddleware("Admin"), addEvent);
router.put("/:id", authMiddleware, roleMiddleware("Admin"), updateEvent);
router.delete("/:id", authMiddleware, roleMiddleware("Admin"), deleteEvent);

export default router;
