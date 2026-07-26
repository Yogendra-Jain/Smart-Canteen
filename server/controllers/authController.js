import bcrypt from "bcryptjs";
import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";

export const registerUser = async (req, res) => {
  try {

        // Step 1: Get data sent by frontend
        const { name, email, password, phone, role } = req.body;

        // Step 2: Validate required fields
        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "Please fill all required fields."
            });
        }

        // Step 3: Check if user already exists
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "User already exists."
            });
        }

        // Step 4: Generate salt and hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Step 5: Create new user
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            phone,
            role
        });

        // Step 6: Generate JWT
        const token = generateToken(user._id);

        // Step 7: Send response
        res.status(201).json({
            success: true,
            message: "Registration successful.",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                role: user.role
            }
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });

    }
};

export const loginUser = async (req, res) => {
    try {

        // Step 1: Get email and password
        const { email, password } = req.body;

        // Step 2: Validate input
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Please provide email and password."
            });
        }

        // Step 3: Find user
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password."
            });
        }

        // Step 4: Compare password
        const isPasswordCorrect = await bcrypt.compare(
            password,
            user.password
        );

        if (!isPasswordCorrect) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password."
            });
        }

        // Step 5: Generate token
        const token = generateToken(user._id);

        // Step 6: Send response
        res.status(200).json({
            success: true,
            message: "Login successful.",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                role: user.role,
            },
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });

    }
};

export const logoutUser = async (req, res) => {

    res.status(200).json({

        success: true,

        message: "Logout Successful"

    });

};



export const getUserProfile = async (req, res) => {

    res.status(200).json({

        success: true,

        user: {

            id: req.user._id,

            name: req.user.name,

            email: req.user.email,

            phone: req.user.phone,

            role: req.user.role,

            avatar: req.user.avatar

        }

    });

};
