import Food from "../models/Food.js";
import cloudinary from "../config/cloudinary.js";
import streamifier from "streamifier";


export const addFood = async (req, res) => {

    try {

        const {
            name,
            description,
            price,
            category,
            isVeg,
            available,
            preparationTime,
            stock
        } = req.body;

        if (
            !name ||
            !description ||
            !price ||
            !category
        ) {

            return res.status(400).json({

                success: false,
                message: "Please fill all required fields."

            });

        }
        // Upload image to Cloudinary

        let imageUrl = "";

        if (req.file) {

            const result = await new Promise((resolve, reject) => {

                const stream = cloudinary.uploader.upload_stream(
                    {
                        folder: "smart-campus-food"
                    },
                    (error, result) => {

                        if (error) return reject(error);

                        resolve(result);

                    }
                );

                streamifier.createReadStream(req.file.buffer).pipe(stream);

            });

            imageUrl = result.secure_url;

        }

        const food = await Food.create({

            name,
            description,
            price,
            category,

            image: imageUrl,

            isVeg,
            available,
            preparationTime,
            stock,

            createdBy: req.user._id

        });

        res.status(201).json({

            success: true,

            message: "Food Added Successfully",

            food

        });

    } catch (error) {

        console.error(error);

        res.status(500).json({

            success: false,

            message: "Internal Server Error"

        });

    }

};


export const getAllFoods = async (req, res) => {

    try {

        const foods = await Food.find();

        res.status(200).json({

            success: true,

            count: foods.length,

            foods

        });

    } catch (error) {

        console.error(error);

        res.status(500).json({

            success: false,

            message: "Internal Server Error"

        });

    }

};

export const getFoodById = async (req, res) => {

    try {

        const food = await Food.findById(req.params.id);

        if (!food) {

            return res.status(404).json({

                success: false,

                message: "Food not found."

            });

        }

        res.status(200).json({

            success: true,

            food

        });

    } catch (error) {

        console.error(error);

        res.status(500).json({

            success: false,

            message: "Internal Server Error"

        });

    }

};


export const updateFood = async (req, res) => {

    try {

        const food = await Food.findByIdAndUpdate(

            req.params.id,

            req.body,

            {
                new: true,
                runValidators: true,
            }

        );

        if (!food) {

            return res.status(404).json({

                success: false,

                message: "Food not found."

            });

        }

        res.status(200).json({

            success: true,

            message: "Food Updated",

            food

        });

    } catch (error) {

        console.error(error);

        res.status(500).json({

            success: false,

            message: "Internal Server Error"

        });

    }

};


export const deleteFood = async (req, res) => {

    try {

        const food = await Food.findByIdAndDelete(req.params.id);

        if (!food) {

            return res.status(404).json({

                success: false,

                message: "Food not found."

            });

        }

        res.status(200).json({

            success: true,

            message: "Food Deleted Successfully"

        });

    } catch (error) {

        console.error(error);

        res.status(500).json({

            success: false,

            message: "Internal Server Error"

        });

    }

};