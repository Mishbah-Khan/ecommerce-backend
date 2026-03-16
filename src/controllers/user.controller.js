import User from "../models/User.model.js";
import bcrypt from "bcryptjs";

const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: parseInt(process.env.COOKIE_EXPIRE_DAYS || '7') * 24 * 60 * 60 * 1000,
}

const userRegister = async (req, res) => {

    try {
        const {
            cus_fax,
            cus_postcode,
            cus_state,
            ship_postcode,
            ship_state,
            ...userData  // This contains ALL other fields from req.body
        } = req.body;

        // Define which fields are actually required
        const requiredFields = [
            'email', 'password', 'cus_name', 'cus_add', 'cus_city',
            'cus_country', 'cus_phone', 'ship_name', 'ship_add',
            'ship_city', 'ship_country', 'ship_phone'
        ];

        // Validate only the fields that should be required
        for (const field of requiredFields) {
            if (!userData[field] || userData[field].trim() === '') {
                throw new Error(`${field} is required and cannot be empty`);
            }
        }

        // Check if User already exists
        const existingUser = await User.findOne({ email: userData.email });
        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: "Email already registered"
            });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(userData.password, salt);

        // Create user
        const user = await User.create({
            ...userData,
            password: hashedPassword,
            cus_fax,
            cus_postcode,
            cus_state,
            ship_postcode,
            ship_state
        });

        // Remove password from response
        const userResponse = user.toObject();
        delete userResponse.password;

        res.status(201).json({
            success: true,
            message: "User registered successfully",
            data: userResponse
        });

    } catch (error) {
        console.error('Registration error:', error);

        // Handle duplicate key error
        if (error.code === 11000) {
            return res.status(409).json({
                success: false,
                message: "Email already exists"
            });
        }

        res.status(500).json({
            success: false,
            message: "Registration failed",
            ...(process.env.NODE_ENV === 'development' && { error: error.message })
        });
    }
}

const userController = {
    userRegister,
}

export default userController;