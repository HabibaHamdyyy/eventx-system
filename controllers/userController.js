import User from "../models/User.js";
import mongoose from "mongoose";

// Add an event to user's favorites
export const addToFavorites = async (req, res) => {
  try {
    const { eventId } = req.body;
    const userId = req.userId; 

    if (!mongoose.Types.ObjectId.isValid(eventId)) {
      return res.status(400).json({ message: "Invalid event ID" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if event is already in favorites
    if (user.favorites.includes(eventId)) {
      return res.status(400).json({ message: "Event already in favorites" });
    }

    // Add to favorites
    user.favorites.push(eventId);
    await user.save();

    res.status(200).json({ message: "Added to favorites", favorites: user.favorites });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Remove an event from user's favorites
export const removeFromFavorites = async (req, res) => {
  try {
    const { eventId } = req.params;
    const userId = req.userId; 

    if (!mongoose.Types.ObjectId.isValid(eventId)) {
      return res.status(400).json({ message: "Invalid event ID" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Remove from favorites
    user.favorites = user.favorites.filter(
      (id) => id.toString() !== eventId
    );
    await user.save();

    res.status(200).json({ message: "Removed from favorites", favorites: user.favorites });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get user's favorite events
export const getFavorites = async (req, res) => {
  try {
    const userId = req.userId; 

    const user = await User.findById(userId).populate("favorites");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ favorites: user.favorites });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all users (for admin analytics)
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}, { password: 0 }); 
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};