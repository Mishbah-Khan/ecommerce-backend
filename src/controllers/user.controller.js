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
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: "Email already registered"
            });
        }

        // Create user
        const user = await User.create({
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
        const user = await User.findOne({email}).select('+password');

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

const userProfile = async (req, res) => {
    try {
        const email = req.header.email;

        const matchStage = {
            $match: { email }
        }

        const project = {
            $project: {
                password: 0,
            }
        }

        const data = await User.aggregate([matchStage, project]);

        res.status(200).json({
            success: true,
            data: data[0],
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.toString(),
            message: "Something went wrong"
        });
    }
}

const userVerify = async (req, res) => {
    try {
        res.status(200).json({ success: true });

    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.toString(),
            message: "Something went wrong"
        });
    }
}

const userUpdate = async (req, res) => {
    try {
        // Fix: Use req.headers (or req.user if using auth middleware)
        const email = req.header.email;
        const _id = req.header._id;
        
        const {
            cus_name,
            oldPassword, 
            newPassword,
            cus_add,
            cus_city,
            cus_country,
            cus_fax,
            cus_phone,
            cus_postcode,
            cus_state,
            ship_name,
            ship_add,
            ship_city,
            ship_country,
            ship_phone,
            ship_postcode,
            ship_state
        } = req.body;

        // Find user with password field
        const existingUser = await User.findOne({email}).select('+password');
        if (!existingUser) {
            return res.status(401).json({
                success: false,
                message: "User not found"
            });
        }

        // Verify old password
        const isMatch = await existingUser.comparePassword(oldPassword);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid password"
            });
        }

        // Prepare update data
        const updateData = {
            cus_name,
            cus_add,
            cus_city,
            cus_country,
            cus_fax,
            cus_phone,
            cus_postcode,
            cus_state,
            ship_name,
            ship_add,
            ship_city,
            ship_country,
            ship_phone,
            ship_postcode,
            ship_state
        };

        // Handle password update if new password is provided
        if (newPassword) {
            existingUser.password = newPassword;
            await existingUser.save();
            
        }

        // Update user - use a different variable name
        const updatedUser = await User.findByIdAndUpdate(
            _id, 
            updateData, 
            { new: true, runValidators: true }
        );

        // Generate token
        const token = tokenHelper.EncodeToken(updatedUser?.email, updatedUser?._id.toString());

        res.cookie("user-token", token, options);
        res.status(200).json({
            success: true,
            message: "Update data successful",
            user: {
                id: updatedUser._id,
                email: updatedUser.email,
                name: updatedUser.cus_name
            },
            token: token
        });
        
    } catch (error) {
        // Handle duplicate key error
        if (error.code === 11000) {
            return res.status(409).json({
                success: false,
                message: "Email already exists"
            });
        }

        // Log error for debugging
        console.error('Update error:', error);

        res.status(500).json({
            success: false,
            message: "Update failed",
            ...(process.env.NODE_ENV === 'development' && { error: error.message })
        });
    }
};

const userLogout =  async (req, res) => {
    try {
        res.clearCookie('user-token');
        res.status(200).json({
            success: true,
            message: "Logout Successful"
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.toString(),
            message: "Something went wrong"
        });
    }
}

const userController = {
    userRegister,
    userLogin,
    userProfile,
    userVerify,
    userUpdate,
    userLogout

}

export default userController;



