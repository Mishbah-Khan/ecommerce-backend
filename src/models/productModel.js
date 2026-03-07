import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    // Basic Information
    name: {
        type: String,
        required: [true, "Product name is required"],
        trim: true
    },
    slug: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    description: {
        type: String,
        required: [true, "Product description is required"]
    },
    shortDescription: {
        type: String,
        default: ""
    },
    
    // Pricing
    price: {
        type: Number,
        required: [true, "Product price is required"],
        min: [0, "Price cannot be negative"]
    },
    discountPrice: {
        type: Number,
        default: 0,
        min: [0, "Discount price cannot be negative"]
    },
    
    // Stock
    stock: {
        type: Number,
        required: [true, "Stock quantity is required"],
        min: [0, "Stock cannot be negative"],
        default: 0
    },
    sku: {
        type: String,
        required: [true, "SKU is required"],
        unique: true
    },

    // Type
    color: {
        type: [String],
        default:''
    },

    size:{
        type: [String],
        default:''

    },
    
    // Media
    images: [{
        type: String,
        default: []
    }],
    thumbnail: {
        type: String,
        default: "default-product.jpg"
    },
    
    // Relationships
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        required: [true, "Category is required"]
    },
    brand: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Brand"
    },
    
    // Status
    isActive: {
        type: Boolean,
        default: true
    },
    isFeatured: {
        type: Boolean,
        default: false
    },
    
    // Tags
    tags: [String]
    
}, {
    timestamps: true,
    versionKey: false,
});

// Generate slug from name before saving
productSchema.pre("save", function(next) {
    if (this.isModified("name")) {
        this.slug = this.name
            .toLowerCase()
            .replace(/[^a-zA-Z0-9]/g, "-")
            .replace(/-+/g, "-")
            .replace(/^-|-$/g, "");
    }
    next();
});

const Product = mongoose.model("Product", productSchema);

export default Product;