import mongoose from "mongoose";

const invoiceItemSchema = new mongoose.Schema({
    // Reference to parent invoice
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    invoice: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Invoice",
        required: true
    },
    
    // Reference to original product
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product"
    },
    
    // Snapshot of product details at time of purchase
    productName: {
        type: String,
        required: true
    },
    productSku: {
        type: String
    },
    productImage: {
        type: String
    },
    
    // Pricing and quantity
    quantity: {
        type: Number,
        required: true,
        min: 1
    },
    price: {
        type: Number,
        required: true,  // Unit price
        min: 0
    },
    discount: {
        type: Number,
        default: 0,       // Discount per item or total discount?
        min: 0
    },
    tax: {
        type: Number,
        default: 0,       // Tax amount for this item
        min: 0
    },
    taxRate: {
        type: Number,
        default: 0        // Tax percentage
    },
    
    // Calculated totals
    subtotal: {
        type: Number,
        required: true,   // price * quantity
        min: 0
    },
    total: {
        type: Number,
        required: true,   // subtotal - discount + tax
        min: 0
    }
}, {
    timestamps: true
});

// Pre-save hook to calculate totals (optional)
invoiceItemSchema.pre("save", function(next) {
    this.subtotal = this.price * this.quantity;
    this.total = this.subtotal - this.discount + this.tax;
    next();
});

const InvoiceItem = mongoose.model("InvoiceItem", invoiceItemSchema);

export default InvoiceItem;