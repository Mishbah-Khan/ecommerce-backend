import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
    // Relationships
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: [true, "Product ID is required"]
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "User ID is required"]
    },
    order: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Order" // To ensure user actually purchased the product
    },
    
    // Review Content
    rating: {
        type: Number,
        required: [true, "Rating is required"],
        min: [1, "Rating must be at least 1"],
        max: [5, "Rating cannot exceed 5"]
    },
    title: {
        type: String,
        trim: true,
        maxlength: [100, "Title cannot exceed 100 characters"]
    },
    comment: {
        type: String,
        required: [true, "Review comment is required"],
        trim: true,
        maxlength: [500, "Comment cannot exceed 500 characters"]
    },
    
    // Media
    images: [{
        type: String
    }],
    
    // Status
    isVerifiedPurchase: {
        type: Boolean,
        default: false
    },
    isApproved: {
        type: Boolean,
        default: true // Auto-approve, set to false if admin approval needed
    },
    isFeatured: {
        type: Boolean,
        default: false
    },
    
    // Admin response
    adminResponse: {
        comment: String,
        respondedAt: Date,
        respondedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Admin"
        }
    }
    
}, {
    timestamps: true
});

// Ensure one review per user per product
reviewSchema.index({ product: 1, user: 1 }, { unique: true });


const Review = mongoose.model("Review", reviewSchema);

export default Review;