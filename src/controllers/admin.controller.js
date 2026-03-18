import Admin from "../models/Admin.model.js";
import bcrypt from "bcryptjs";
import tokenHelper from "../utility/token.utility.js"

const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: parseInt(process.env.COOKIE_EXPIRE_DAYS || '7') * 24 * 60 * 60 * 1000,
}

// Register Admin
const adminRegister = async (req, res) => {
    try {
        const { firstName, lastName, email, password } = req.body;

        // Check if all fields are provided
        if (!firstName || !lastName || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "Please provide all required fields"
            });
        }

        // Check if admin already exists
        const existingAdmin = await Admin.findOne({ email });
        if (existingAdmin) {
            return res.status(400).json({
                success: false,
                message: "Admin with this email already exists"
            });
        }

        // Create new admin
        const admin = new Admin({
            firstName,
            lastName,
            email,
            password
        });

        // Save to database
        await admin.save();

        // Remove password from response
        const adminData = admin.toObject();
        delete adminData.password;

        res.status(201).json({
            success: true,
            message: "Admin registered successfully",
            data: adminData
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error registering admin",
            error: error.message
        });
    }
};

const adminLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        //find user is exist or not 
        const user = await Admin.findOne({ email }).select('+password');

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "Invalid email"
            });
        }

        // matching password
        const isMatch = await user.comparePassword(password);

        if (!isMatch) {
            return res.status(200).json({
                success: false,
                message: "Invalid password"
            });
        }

        if (isMatch) {
            const token = tokenHelper.EncodeToken(user?.email, user?._id?.toString());

            res.cookie('admin-token', token, options);

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
            error: error.toString(),
            message: "Something went wrong"
        });
    }
}

const adminProfile = async (req, res) => {
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

        const data = await Admin.aggregate([matchStage, project]);

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

const adminVerify = async (req, res) => {
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

const adminUpdate = async (req, res) => {
    try {
        const { email, oldPassword, newPassword } = req.body;

        const _id = req.header._id;
        const userEmail = req.header.email;

        // Prepare update object
        const updateData = {};

        // If email is being updated, check if it's already taken
        if (email && email !== userEmail) {
            const existingUser = await Admin.findOne({ email });
            if (existingUser) {
                return res.status(409).json({
                    success: false,
                    message: "Email already in use"
                });
            }
            updateData.email = email;
        }

        // Find user by ID
        const user = await Admin.findById(_id).select('+password');

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        // Verify old password if trying to change password
        if (newPassword) {
            if (!oldPassword) {
                return res.status(400).json({
                    success: false,
                    message: "Old password is required to set new password"
                });
            }

            const isMatch = await user.comparePassword(oldPassword);
            if (!isMatch) {
                return res.status(401).json({
                    success: false,
                    message: "Invalid old password"
                });
            }

            // Hash new password
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(newPassword, salt);
            updateData.password = hashedPassword;
        }

        // Update user
        const updatedUser = await Admin.findByIdAndUpdate(
            _id,
            updateData,
            {
                new: true,
                runValidators: true
            }
        );  // Exclude password from response

        // Generate new token
        const token = tokenHelper.EncodeToken(updatedUser.email, updatedUser._id.toString());

        // Set cookie
        res.cookie('admin-token', token, options);

        res.status(200).json({
            success: true,
            message: "Admin updated successfully",
            user: {
                email: updatedUser.email,
                token: token
            }
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message,
            message: "Something went wrong"
        });
    }
}

const adminLogout = async (req, res) => {
    try {
        res.clearCookie('admin-token');
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


const adminController = {
    adminRegister,
    adminLogin,
    adminProfile,
    adminVerify,
    adminUpdate,
    adminLogout,
};

export default adminController;
