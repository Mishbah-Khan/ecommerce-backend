import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    slug: {
        type: String,
        unique: true
    }
}, {
    timestamps: true,
    versionKey: false,
});

// Auto-generate slug
categorySchema.pre("save", function(next) {
    this.slug = this.name.toLowerCase().replace(/\s+/g, "-");
    next();
});

const Category = mongoose.model("Category", categorySchema);

export default Category;