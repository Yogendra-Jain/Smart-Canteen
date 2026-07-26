import Cart from "../models/Cart.js";
import Food from "../models/Food.js";

export const addToCart = async (req, res) => {
    try {

        const { foodId, quantity } = req.body;

        if (!foodId) {
            return res.status(400).json({
                success: false,
                message: "Food ID is required."
            });
        }

        const food = await Food.findById(foodId);

        if (!food) {
            return res.status(404).json({
                success: false,
                message: "Food not found."
            });
        }

        const existingItem = await Cart.findOne({
            user: req.user._id,
            food: foodId
        });

        if (existingItem) {

            existingItem.quantity += quantity || 1;

            await existingItem.save();

            return res.status(200).json({
                success: true,
                message: "Cart updated successfully.",
                cart: existingItem
            });

        }

        const cartItem = await Cart.create({
            user: req.user._id,
            food: foodId,
            quantity: quantity || 1
        });

        res.status(201).json({
            success: true,
            message: "Item added to cart.",
            cart: cartItem
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });

    }
};

export const getCart = async (req, res) => {
    try {
        const cart = await Cart.find({
            user: req.user._id
        }).populate("food");

        res.status(200).json({
            success: true,
            count: cart.length,
            cart
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};

export const updateCart = async (req, res) => {
    try {
        const { quantity } = req.body;

        if (!quantity || quantity < 1) {
            return res.status(400).json({
                success: false,
                message: "Quantity must be at least 1."
            });
        }

        const cartItem = await Cart.findOne({
            _id: req.params.id,
            user: req.user._id
        });

        if (!cartItem) {
            return res.status(404).json({
                success: false,
                message: "Cart item not found."
            });
        }

        cartItem.quantity = quantity;

        await cartItem.save();

        res.status(200).json({
            success: true,
            message: "Cart updated successfully.",
            cart: cartItem
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};

export const removeCartItem = async (req, res) => {
    try {
        const cartItem = await Cart.findOne({
            _id: req.params.id,
            user: req.user._id
        });

        if (!cartItem) {
            return res.status(404).json({
                success: false,
                message: "Cart item not found."
            });
        }

        await cartItem.deleteOne();

        res.status(200).json({
            success: true,
            message: "Item removed from cart."
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};

export const clearCart = async (req, res) => {
    try {
        await Cart.deleteMany({
            user: req.user._id
        });

        res.status(200).json({
            success: true,
            message: "Cart cleared successfully."
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};
