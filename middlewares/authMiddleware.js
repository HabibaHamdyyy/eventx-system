import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const authMiddleware = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader) return res.status(401).json({ message: "No token" });

  const token = authHeader.split(" ")[1]; 
  if (!token) return res.status(401).json({ message: "No token" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    req.userId = decoded.id; 
    next();
  } catch (error) {
    res.status(401).json({ message: "Token is not valid" });
  }

};
