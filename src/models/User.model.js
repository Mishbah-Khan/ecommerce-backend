import mongoose from "mongoose";
import bcrypt from "bcryptjs";

// User Auth Schema (Registration only)
const userAuthSchema = new mongoose.Schema({
    cus_name: { 
        type: String,
        required: [true, "Customer name is required"] 
    },
    email: {
        type: String,
        unique: true,
        lowercase: true,
        trim: true,
        required: [true, "Email is required"],
        index: true
    },
    password: { 
        type: String, 
        required: [true, "Password is required"] 
    },
    // Reference to profile (created after registration)
    profile: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'UserProfile'
    },
}, {
    timestamps: true,
    versionKey: false,
});

// User Profile Schema (Complete information)
const userProfileSchema = new mongoose.Schema({
    // Reference back to auth
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'UserAuth',
        required: true,
        unique: true
    },

    // Customer information
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
userAuthSchema.pre("save", async function(next) {
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
userAuthSchema.methods.comparePassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

// Method to get complete user profile
userAuthSchema.methods.getCompleteProfile = async function() {
    await this.populate('profile');
    return this;
};

const UserAuth = mongoose.model("UserAuth", userAuthSchema);
const UserProfile = mongoose.model("UserProfile", userProfileSchema);

const User = {
    UserAuth,
    UserProfile
}
export default User;