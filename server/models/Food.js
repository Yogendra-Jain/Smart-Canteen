import mongoose from "mongoose";

const foodSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },

        description: {
            type: String,
            required: true,
        },

        price: {
            type: Number,
            required: true,
        },

        category: {
            type: String,
            required: true,
            enum: [
                "Breakfast",
                "Lunch",
                "Dinner",
                "Snacks",
                "Beverages",
                "Desserts"
            ]
        },

        image: {
            type: String,
            default: ""
        },

        isVeg: {
            type: Boolean,
            default: true,
        },

        available: {
            type: Boolean,
            default: true,
        },

        preparationTime: {
            type: Number,
            default: 15,
        },

        rating: {
            type: Number,
            default: 0,
        },

        stock: {
            type: Number,
            default: 100,
        },

        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        }

    },
    {
        timestamps: true,
    }
);

const Food = mongoose.model("Food", foodSchema);

export default Food;