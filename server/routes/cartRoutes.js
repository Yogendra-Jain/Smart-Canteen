import express from "express";

import { addToCart, getCart, updateCart, removeCartItem, clearCart } from "../controllers/cartController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/add", protect, addToCart);
router.get("/", protect, getCart);
router.put("/:id", protect, updateCart);
router.delete("/clear", protect, clearCart);
router.delete("/:id", protect, removeCartItem);

export default router;
