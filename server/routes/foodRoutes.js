import express from "express";
import { adminOnly } from "../middleware/adminMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";
import {
    addFood,
    getAllFoods,
    getFoodById,
    updateFood,
    deleteFood
} from "../controllers/foodController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, adminOnly, upload.single("image"), addFood );

router.get("/", getAllFoods);

router.get("/:id", getFoodById);

router.put("/:id", protect, adminOnly, updateFood);

router.delete("/:id", protect, adminOnly, deleteFood);

export default router;