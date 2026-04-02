import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema({
    title: { 
        type: String,
        trim: true
    },
    images: [String],
    sort_description: { 
        type: String,
        trim: true
    },
    price: { 
        type: Number,
        min: 0
    },
    is_discount: { 
        type: Boolean,
        default: false
    },
    discount_price: { 
        type: Number,
        min: 0
    },
    remark: { 
        type: String,
        trim: true
    },
    stock: { 
        type: Number,
        min: 0,
        default: 0
    },
    color: [String],
    size: [String],
    description: { 
        type: String,
        trim: true
    },
    category: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Category',
        required: true 
    },
    brand: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Brand',
        required: true 
    }
}, {
    timestamps: true,
    versionKey: false
});

// Optional: Add indexes for better query performance
ProductSchema.index({ category_id: 1 });
ProductSchema.index({ brand_id: 1 });
ProductSchema.index({ price: 1 });
ProductSchema.index({ createdAt: -1 });

// Optional: Virtual field to get discounted price
ProductSchema.virtual('final_price').get(function() {
    if (this.is_discount && this.discount_price) {
        return this.discount_price;
    }
    return this.price;
});

// Optional: Method to check if product is in stock
ProductSchema.methods.isInStock = function(quantity = 1) {
    return this.stock >= quantity;
};

const Product = mongoose.model('Product', ProductSchema);

export default Product;


