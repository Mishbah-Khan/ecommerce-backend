import mongoose from "mongoose";

const invoiceItemSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true
    },
    name: {
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        min: 1
    },
    price: {
        type: Number,
        required: true
    },
    total: {
        type: Number,
        required: true
    }
});

const invoiceSchema = new mongoose.Schema({
    // Invoice Number (unique)
    invoiceNumber: {
        type: String,
        required: true,
        unique: true
    },
    
    // Order Reference
    order: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Order",
        required: true
    },
    
    // Customer Information
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    customerName: {
        type: String,
        required: true
    },
    customerEmail: {
        type: String,
        required: true
    },
    customerPhone: String,
    
    // Billing Address
    billingAddress: {
        street: String,
        city: String,
        state: String,
        postalCode: String,
        country: String
    },
    
    // Shipping Address
    shippingAddress: {
        street: String,
        city: String,
        state: String,
        postalCode: String,
        country: String
    },
    
    // Invoice Items
    items: [invoiceItemSchema],
    
    // Financial Summary
    subtotal: {
        type: Number,
        required: true
    },
    tax: {
        type: Number,
        default: 0
    },
    taxRate: {
        type: Number,
        default: 0
    },
    shippingCost: {
        type: Number,
        default: 0
    },
    discount: {
        type: Number,
        default: 0
    },
    couponCode: String,
    total: {
        type: Number,
        required: true
    },
    paidAmount: {
        type: Number,
        default: 0
    },
    dueAmount: {
        type: Number,
        default: 0
    },
    
    // Payment Information
    paymentMethod: {
        type: String,
        enum: ["cash", "card", "bank", "mobile", "other"],
        required: true
    },
    paymentStatus: {
        type: String,
        enum: ["pending", "paid", "partial", "refunded", "cancelled"],
        default: "pending"
    },
    transactionId: {type: String, required:true},
    validationId: {type: String, required:true},

    paymentDate: Date,
    
    // Invoice Dates
    invoiceDate: {
        type: Date,
        default: Date.now
    },
    dueDate: Date,
    
    // Status
    status: {
        type: String,
        enum: ["pending", "sent", "paid", "overdue", "cancelled", "refunded"],
        default: "pending"
    },
    
    // Additional Info
    notes: String,
    termsAndConditions: String,
    
    // Company Details (for the invoice)
    companyDetails: {
        name: String,
        address: String,
        phone: String,
        email: String,
        vatNumber: String,
        logo: String
    }
    
}, {
    timestamps: true
});

// Generate invoice number before saving
invoiceSchema.pre("save", async function(next) {
    if (this.isNew) {
        // Format: INV-YYYYMMDD-XXXX
        const date = new Date();
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const dateStr = `${year}${month}${day}`;
        
        // Get count of invoices created today to generate sequence
        const count = await this.constructor.countDocuments({
            invoiceDate: {
                $gte: new Date(date.setHours(0, 0, 0, 0)),
                $lt: new Date(date.setHours(23, 59, 59, 999))
            }
        });
        
        const sequence = String(count + 1).padStart(4, '0');
        this.invoiceNumber = `INV-${dateStr}-${sequence}`;
    }
    next();
});

// Calculate due amount before saving
invoiceSchema.pre("save", function(next) {
    this.dueAmount = this.total - this.paidAmount;
    next();
});

const Invoice = mongoose.model("Invoice", invoiceSchema);

export default Invoice;