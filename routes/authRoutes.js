import express from "express";
import cors from "cors";
import { register, login } from "../controllers/authController.js";

const router = express.Router();

// Configure CORS specifically for auth routes
const authCorsOptions = {
  origin: ["http://localhost:5173", "https://eventx-system-frontend.vercel.app"],
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
  preflightContinue: false,
  optionsSuccessStatus: 204
};

// Apply CORS middleware specifically for auth routes
router.use(cors(authCorsOptions));

// Handle OPTIONS requests explicitly
router.options("*", cors(authCorsOptions));

router.post("/register", register);
router.post("/login", login);

export default router;
