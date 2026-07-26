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
  res.json({ message: 'Login User route placeholder' });
};

export const logoutUser = async (req, res) => {
  res.json({ message: 'Logout User route placeholder' });
};

export const getUserProfile = async (req, res) => {
  res.json({ message: 'Get User Profile route placeholder' });
};
