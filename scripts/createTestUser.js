import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import User from "../models/User.js";

dotenv.config();

const createTestUser = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ Connected to MongoDB");

    // Check if admin user already exists
    const existingAdmin = await User.findOne({ email: "admin@eventx.com" });
    if (existingAdmin) {
      console.log("❌ Admin user already exists");
      process.exit(0);
    }

    // Create admin user
    const hashedPassword = await bcrypt.hash("admin123", 10);
    const adminUser = await User.create({
      name: "Admin User",
      email: "admin@eventx.com",
      password: hashedPassword,
      role: "Admin"
    });

    console.log("✅ Admin user created successfully:");
    console.log("📧 Email: admin@eventx.com");
    console.log("🔑 Password: admin123");
    console.log("👤 Role: Admin");

    // Create regular test user
    const testUser = await User.create({
      name: "Test User",
      email: "user@eventx.com", 
      password: await bcrypt.hash("user123", 10),
      role: "User"
    });

    console.log("✅ Test user created successfully:");
    console.log("📧 Email: user@eventx.com");
    console.log("🔑 Password: user123");
    console.log("👤 Role: User");

    process.exit(0);
  } catch (error) {
    console.error("❌ Error creating test users:", error);
    process.exit(1);
  }
};

createTestUser();
