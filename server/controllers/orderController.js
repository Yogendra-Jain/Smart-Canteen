import Order from "../models/Order.js";
import Cart from "../models/Cart.js";
import User from "../models/User.js";
import Food from "../models/Food.js";

export const placeOrder = async (req, res) => {
    try {
        const { deliveryType, paymentMethod } = req.body;

        const cartItems = await Cart.find({
            user: req.user._id
        }).populate("food");

        if (cartItems.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Your cart is empty."
            });
        }

        let totalAmount = 0;

        const items = cartItems.map(item => {
            totalAmount += item.food.price * item.quantity;
            return {
                food: item.food._id,
                name: item.food.name,
                price: item.food.price,
                quantity: item.quantity
            };
        });

        const order = await Order.create({
            user: req.user._id,
            items,
            totalAmount,
            deliveryType,
            paymentMethod
        });

        await Cart.deleteMany({
            user: req.user._id
        });

        res.status(201).json({
            success: true,
            message: "Order placed successfully.",
            order
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};

export const getMyOrders = async (req, res) => {
    try {
        const orders = await Order.find({
            user: req.user._id
        }).sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: orders.length,
            orders
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};

export const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find()
            .populate("user", "name email")
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: orders.length,
            orders
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};

export const updateOrderStatus = async (req, res) => {
    try {
        const { orderStatus } = req.body;

        const validStatus = [
            "pending",
            "preparing",
            "ready",
            "out_for_delivery",
            "delivered",
            "cancelled"
        ];

        if (!validStatus.includes(orderStatus)) {
            return res.status(400).json({
                success: false,
                message: "Invalid order status."
            });
        }

        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found."
            });
        }

        order.orderStatus = orderStatus;

        await order.save();

        res.status(200).json({
            success: true,
            message: "Order status updated successfully.",
            order
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};

export const getDashboardStats = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const totalFoods = await Food.countDocuments();
        const totalOrders = await Order.countDocuments();

        const pendingOrders = await Order.countDocuments({
            orderStatus: "pending"
        });

        const deliveredOrders = await Order.countDocuments({
            orderStatus: "delivered"
        });

        const cancelledOrders = await Order.countDocuments({
            orderStatus: "cancelled"
        });

        const revenue = await Order.aggregate([
            {
                $match: {
                    paymentStatus: "paid"
                }
            },
            {
                $group: {
                    _id: null,
                    totalRevenue: {
                        $sum: "$totalAmount"
                    }
                }
            }
        ]);

        const recentOrders = await Order.find()
            .populate("user", "name email")
            .sort({ createdAt: -1 })
            .limit(5);

        res.status(200).json({
            success: true,
            stats: {
                totalUsers,
                totalFoods,
                totalOrders,
                pendingOrders,
                deliveredOrders,
                cancelledOrders,
                totalRevenue: revenue[0]?.totalRevenue || 0,
                recentOrders
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};
