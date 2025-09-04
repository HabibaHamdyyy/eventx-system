import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const app = express();



// Middleware
app.use(cors({
  origin: [
    "http://localhost:5173",
    "http://localhost:5000", 
    "https://eventx-system.vercel.app",
    "https://eventx-system-git-main-hamdyhabiba952-9998s-projects.vercel.app"
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
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
const PORT = process.env.PORT || 10000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`MongoDB URI: ${process.env.MONGO_URI ? 'Connected' : 'Not configured'}`);
});
