import Admin from "../models/Admin.model.js";
import bcrypt from "bcryptjs";
import tokenHelper from "../utility/token.utility.js"


const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: parseInt( process.env.COOKIE_EXPIRE_DAYS || '7' ) * 24 * 60 * 60 * 1000,
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

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new admin
        const admin = new Admin({
            firstName,
            lastName,
            email,
            password: hashedPassword
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
            return res.status(401).json({
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
            $match: {email}
        }

        const project = {
            $project : {
                password: 0,
            }
        }

        const data =  await Admin.aggregate([matchStage, project]);

        res.status(200).json({
            success: true,
            data: data[0],
        });

        console.log(data);
        


    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.toString(),
            message: "Something went wrong"
        });
    }
}

const adminLogout = () => {
    try {

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
    adminLogout,
};

export default adminController;
