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

    // Customer information
    cus_add: { 
        type: String,

    },
    cus_city: { 
        type: String,

    },
    cus_country: { 
        type: String,
        default: "Bangladesh" 
    },
    cus_fax: { 
        type: String 
    },
    cus_phone: { 
        type: String,
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
    },
    ship_add: { 
        type: String,

    },
    ship_city: { 
        type: String,
    },
    ship_country: { 
        type: String,
        default: "Bangladesh" 
    },
    ship_phone: { 
        type: String,
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

const User = mongoose.model("User", userAuthSchema);

export default User;