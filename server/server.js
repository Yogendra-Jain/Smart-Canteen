import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";

// Load environment variables
dotenv.config();

// Create Express app
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(cookieParser());

// Test Route
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Smart Canteen Backend is Running 🚀",
  });
});

// PORT
const PORT = process.env.PORT || 5000;

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});