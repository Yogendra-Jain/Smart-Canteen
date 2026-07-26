import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";

import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import foodRoutes from "./routes/foodRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
dotenv.config();

const app = express();

connectDB();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(cookieParser());

// Home Route
app.get("/", (req, res) => {
    res.json({
        message: "Smart Campus Food Ordering Backend Running 🚀"
    });
});

// Authentication Routes
app.use("/api/auth", authRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/foods", foodRoutes);


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});