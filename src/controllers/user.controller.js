import User from "../models/User.model.js";
import bcrypt from "bcryptjs";
import tokenHelper from "../utility/token.utility.js"

const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: parseInt(process.env.COOKIE_EXPIRE_DAYS || '7') * 24 * 60 * 60 * 1000,
}

const userRegister = async (req, res) => {

    try {
        const {cus_name, email, password } = req.body;

        // Check if User already exists
        const existingUser = await User.UserAuth.findOne({ email });
        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: "Email already registered"
            });
        }

        // Create user
        const user = await User.UserAuth.create({
            cus_name, 
            email, 
            password,
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

const userLogin = async (req, res) => {
    try {
        const {email, password} = req.body;
        const user = await User.UserAuth.findOne({email}).select('+password');

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "Invalid email"
            });
        }

        // matching password
        const isMatch = await user.comparePassword(password);

        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid password"
            });
        }

        if (isMatch) {
            const token = tokenHelper.EncodeToken(user?.email, user?._id?.toString());

            res.cookie('user-token', token, options);

            const userData = user.toObject();
            delete userData.password;

            res.status(200).json({
                success: true,
                message: "Login successful",
                user: {
                    id: user?._id,
                    email: user?.email,
                },
                token: token,
            });
        }

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Login failed",
            ...(process.env.NODE_ENV === 'development' && { error: error.message })
        });
    }
}

const userUpdate = async (req, res) => {
try {
        // const {
        //     cus_fax,
        //     cus_postcode,
        //     cus_state,
        //     ship_postcode,
        //     ship_state,
        //     ...userData  // This contains ALL other fields from req.body
        // } = req.body;

        // // Define which fields are actually required
        // const requiredFields = [
        //     'email', 'password', 'cus_name', 'cus_add', 'cus_city',
        //     'cus_country', 'cus_phone', 'ship_name', 'ship_add',
        //     'ship_city', 'ship_country', 'ship_phone'
        // ];

        // // Validate only the fields that should be required
        // for (const field of requiredFields) {
        //     if (!userData[field] || userData[field].trim() === '') {
        //         throw new Error(`${field} is required and cannot be empty`);
        //     }
        // }

        // // Check if User already exists
        // const existingUser = await User.findOne({ email: userData.email });
        // if (existingUser) {
        //     return res.status(409).json({
        //         success: false,
        //         message: "Email already registered"
        //     });
        // }

        // // Hash password
        // const salt = await bcrypt.genSalt(10);
        // const hashedPassword = await bcrypt.hash(userData.password, salt);

        // // Create user
        // const user = await User.create({
        //     ...userData,
        //     password: hashedPassword,
        //     cus_fax,
        //     cus_postcode,
        //     cus_state,
        //     ship_postcode,
        //     ship_state
        // });

        // // Remove password from response
        // const userResponse = user.toObject();
        // delete userResponse.password;

        // res.status(201).json({
        //     success: true,
        //     message: "User registered successfully",
        //     data: userResponse
        // });

    } catch (error) {
        
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

const userProfile =  async (req, res) => {
    
}




const userController = {
    userRegister,
    userLogin,
    userUpdate,
    userProfile
}

export default userController;