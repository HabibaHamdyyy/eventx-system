import express from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { roleMiddleware } from "../middlewares/roleMiddleware.js";
import { addToFavorites, removeFromFavorites, getFavorites, getAllUsers } from "../controllers/userController.js";

const router = express.Router();

router.get("/profile", authMiddleware, (req, res) => {
  res.json({ message: `Welcome ${req.user.id}, Role: ${req.user.role}` });
});

router.get("/admin", authMiddleware, roleMiddleware(["Admin"]), (req, res) => {
  res.json({ message: "Admin dashboard" });
});

// Favorites routes
router.post("/favorites", authMiddleware, addToFavorites);
router.delete("/favorites/:eventId", authMiddleware, removeFromFavorites);
router.get("/favorites", authMiddleware, getFavorites);

// Admin routes
router.get("/admin/all", authMiddleware, roleMiddleware(["Admin"]), getAllUsers);

export default router;
