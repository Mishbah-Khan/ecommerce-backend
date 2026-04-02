import mongoose from "mongoose";

const brandSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    slug: {
        type: String,
        unique: true
    },
    logo: {
        type: String,
        default: "default-brand.jpg"
    }
}, {
    timestamps: true,
    versionKey: false,
});

// Auto-generate slug
brandSchema.pre("save", function(next) {
    this.slug = this.name.toLowerCase().replace(/\s+/g, "-");
    next();
});

const Brand = mongoose.model("Brand", brandSchema);

export default Brand;