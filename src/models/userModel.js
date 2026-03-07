import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
    // Auth fields
    email: {
        type: String,
        unique: true,
        lowercase: true,
        trim: true,
        required: [true, "Email is required"]
    },
    password: { 
        type: String, 
        required: [true, "Password is required"] 
    },
    
    // Customer information
    cus_name: { 
        type: String,
        required: [true, "Customer name is required"] 
    },
    cus_add: { 
        type: String,
        required: [true, "Customer address is required"] 
    },
    cus_city: { 
        type: String,
        required: [true, "City is required"] 
    },
    cus_country: { 
        type: String,
        required: [true, "Country is required"],
        default: "Bangladesh" 
    },
    cus_fax: { 
        type: String 
    },
    cus_phone: { 
        type: String,
        required: [true, "Phone number is required"] 
    },
    cus_postcode: { 
        type: String 
    },
    cus_state: { 
        type: String 
    },
    
    // Shipping information
    ship_name: { 
        type: String,
        required: [true, "Shipping name is required"] 
    },
    ship_add: { 
        type: String,
        required: [true, "Shipping address is required"] 
    },
    ship_city: { 
        type: String,
        required: [true, "Shipping city is required"] 
    },
    ship_country: { 
        type: String,
        required: [true, "Shipping country is required"],
        default: "Bangladesh" 
    },
    ship_phone: { 
        type: String,
        required: [true, "Shipping phone is required"] 
    },
    ship_postcode: { 
        type: String 
    },
    ship_state: { 
        type: String 
    }
    
}, {
    timestamps: true,
    versionKey: false,
});

// Hash password before saving
userSchema.pre("save", async function(next) {
    if (!this.isModified("password")) return next();
    
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

// Method to compare password
userSchema.methods.comparePassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model("User", userSchema);

export default User;