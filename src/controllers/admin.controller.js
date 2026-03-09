import Admin from "../models/Admin.model.js";
import bcrypt from "bcryptjs";

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

const adminController = {
    adminRegister,
};

export default adminController;
