import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import Event from "./models/Event.js";
import Ticket from "./models/Ticket.js";
import path from "path";
import { fileURLToPath } from "url";

// Configure dotenv with quiet option to prevent tips that cause path-to-regexp errors
dotenv.config({ quiet: true });

const app = express();


app.get("/api", (req, res) => {
  res.send("Hello from Vercel!");
});

// ✅ Middleware CORS
app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://eventx-system-frontend.vercel.app",
    "http://localhost:5000",
    "https://eventx-system-backend.vercel.app",
    "http://localhost:5174",
    "http://localhost:5175",
    "https://eventx-system-git-main-hamdyhabiba952-9998s-projects.vercel.app"
  ],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  preflightContinue: false,
  optionsSuccessStatus: 204
}));

// ✅ Handle preflight requests
app.options("*", cors());

// CORS error handler
app.use((err, req, res, next) => {
  if (err.name === 'CORSError' || err.message.includes('CORS')) {
    console.error('CORS Error:', err);
    return res.status(403).json({
      error: 'CORS Error',
      message: 'Cross-Origin Request Blocked',
      details: err.message
    });
  }
  next(err);
});

app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.error("❌ MongoDB error:", err));

// Test endpoint
app.get("/api/test", (req, res) => {
  res.json({ message: "Server is running!", timestamp: new Date().toISOString() });
});

// Simple notifications endpoint (mock data)
app.get("/api/notifications", async (req, res) => {
  try {
    const now = new Date();
    const upcomingThresholdDays = 3; // events starting within N days
    const lowSeatsThreshold = 10; // seats remaining below this

    // Fetch events
    const events = await Event.find({});

    // Build notifications based on event state
    const notifications = [];

    events.forEach(ev => {
      const start = new Date(ev.date);
      const diffDays = Math.floor((start - now) / (1000 * 60 * 60 * 24));

      if (diffDays >= 0 && diffDays <= upcomingThresholdDays) {
        notifications.push({
          type: "upcoming",
          message: `Upcoming: "${ev.title}" in ${diffDays === 0 ? 'today' : `${diffDays} day(s)`}`,
          eventId: ev._id,
          time: now.toISOString(),
        });
      }

      if (start < now) {
        notifications.push({
          type: "closed",
          message: `Closed: "${ev.title}" has already ended`,
          eventId: ev._id,
          time: now.toISOString(),
        });
      }

      if ((ev.availableSeats ?? 0) > 0 && ev.availableSeats <= lowSeatsThreshold) {
        notifications.push({
          type: "low_seats",
          message: `Hurry: "${ev.title}" has only ${ev.availableSeats} seats left`,
          eventId: ev._id,
          time: now.toISOString(),
        });
      }
    });

    res.json(notifications);
  } catch (e) {
    console.error("/api/notifications error:", e);
    res.status(500).json({ error: "Server error" });
  }
});

// Routes
import authRoutes from "./routes/authRoutes.js";
app.use("/api/auth", authRoutes);
import userRoutes from "./routes/userRoutes.js";
app.use("/api/users", userRoutes);
import eventRoutes from "./routes/eventRoutes.js";
app.use("/api/events", eventRoutes);
import ticketRoutes from "./routes/ticketRoutes.js";
app.use("/api/tickets", ticketRoutes);



// Server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});


export default app;

