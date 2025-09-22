import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "../lib/prisma.js";
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

// POST /api/auth/register - Register a new user
router.post("/register", async (req, res) => {
  try {
    // TODO: Implement the registration logic
    // 1. Validate the input
    const { email, password } = req.body;
    // 2. Check if the user already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }
    // 3. Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    // 4. Create the user
    const newUser = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
      },
    });
    // 5. Generate a JWT token
    const token = jwt.sign({ userId: newUser.id }, JWT_SECRET, { expiresIn: "1h" });
    // 6. Return the user data and token
    res.status(201).json({
      success: true,
      data: {
        user: {
          id: newUser.id,
          email: newUser.email,
        },
        token,
      },
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({
      success: false,
      message: "Error registering user",
      error: error.message,
    });
  }
});

// POST /api/auth/login - Login user
router.post("/login", async (req, res) => {
  try {
    // TODO: Implement the login logic
    // 1. Validate the input
    const { email, password } = req.body;
    // Placeholder response
    res.status(501).json({
      success: false,
      message: "Login not implemented yet",
    });
    // 2. Check if the user exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (!existingUser) {
      return res.status(400).json({
        success: false,
        message: "Invalid email or password",
      });
    }
    // 3. Compare the password
    const isPasswordValid = await bcrypt.compare(password, existingUser.password);
    if (!isPasswordValid) {
      return res.status(400).json({
        success: false,
        message: "Invalid email or password",
      });
    }
    // 4. Generate a JWT token
    const token = jwt.sign({ userId: existingUser.id }, JWT_SECRET, { expiresIn: "1h" });
    // 5. Return the user data and token
    res.status(200).json({
      success: true,
      data: {
        user: {
          id: existingUser.id,
          email: existingUser.email,
        },
        token,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      success: false,
      message: "Error logging in",
      error: error.message,
    });
  }
});

// GET /api/auth/me - Get current user profile (protected route)
router.get("/me", authenticateToken, async (req, res) => {
  try {
    // req.user will be set by the authenticateToken middleware
    const { password, ...userWithoutPassword } = req.user;

    res.json({
      success: true,
      data: userWithoutPassword,
    });
  } catch (error) {
    console.error("Get profile error:", error);
    res.status(500).json({
      success: false,
      message: "Error retrieving user profile",
      error: error.message,
    });
  }
});

export default router;
