import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import eventRoutes from "./routes/eventRoutes.js";
import ticketRoutes from "./routes/ticketRoutes.js";
import Event from "./models/Event.js";

dotenv.config({ quiet: true });

const app = express();

// ✅ Middleware
app.use(express.json());

// ✅ CORS
app.use(cors({
  origin: "https://eventx-system-frontend.vercel.app",
  credentials: true,
}));

// ✅ Test endpoint
app.get("/api/test", (req, res) => {
  res.json({ message: "Server is running!", timestamp: new Date().toISOString() });
});

// ✅ Notifications endpoint
app.get("/api/notifications", async (req, res) => {
  try {
    const now = new Date();
    const upcomingThresholdDays = 3;
    const lowSeatsThreshold = 10;

    const events = await Event.find({});
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

// ✅ Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/tickets", ticketRoutes);

// ✅ MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("✅ MongoDB connected"))
.catch(err => console.error("❌ MongoDB error:", err));

// ✅ Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

export default app;
