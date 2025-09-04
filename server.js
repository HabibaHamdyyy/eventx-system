import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const app = express();



// Middleware
app.use(cors());
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
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
