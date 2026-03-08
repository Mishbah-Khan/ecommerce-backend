import mongoose from "mongoose";

const cartItemSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        min: [1, "Quantity cannot be less than 1"],
        default: 1
    },
    price: {
        type: Number,
        required: true // Price at the time of adding to cart
    },
    total: {
        type: Number,
        required: true // price * quantity
    }
});

const cartSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        unique: true // One cart per user
    },
    items: [cartItemSchema],
    subtotal: {
        type: Number,
        default: 0
    },
    coupon: {
        type: String,
        default: null
    },
    discount: {
        type: Number,
        default: 0
    },
    total: {
        type: Number,
        default: 0
    },
    expiresAt: {
        type: Date,
        default: () => new Date(+new Date() + 7*24*60*60*1000) // 7 days from now
    }
}, {
    timestamps: true
});

// Calculate totals before saving
cartSchema.pre("save", function(next) {
    // Calculate subtotal
    this.subtotal = this.items.reduce((sum, item) => sum + item.total, 0);
    
    // Calculate total (subtotal - discount)
    this.total = this.subtotal - this.discount;
    
    next();
});

// Calculate item total before saving each item
cartItemSchema.pre("save", function(next) {
    this.total = this.price * this.quantity;
    next();
});

const Cart = mongoose.model("Cart", cartSchema);

export default Cart;