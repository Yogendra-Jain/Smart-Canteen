import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema({
    food: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Food",
        required: true
    },
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    }
});

const orderSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        items: [orderItemSchema],

        totalAmount: {
            type: Number,
            required: true
        },

        deliveryType: {
            type: String,
            enum: ["pickup", "delivery"],
            default: "pickup"
        },

        paymentMethod: {
            type: String,
            enum: ["cash", "online"],
            default: "cash"
        },

        paymentStatus: {
            type: String,
            enum: ["pending", "paid"],
            default: "pending"
        },

        orderStatus: {
            type: String,
            enum: [
                "pending",
                "preparing",
                "ready",
                "out_for_delivery",
                "delivered",
                "cancelled"
            ],
            default: "pending"
        }
    },
    {
        timestamps: true
    }
);

const Order = mongoose.model("Order", orderSchema);

export default Order;
