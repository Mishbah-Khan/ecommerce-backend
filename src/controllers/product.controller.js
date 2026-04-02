import Product from "../models/Product.model.js";

const createProduct = async (req, res) => {
    try {
        const {
            title,
            images,
            sort_description,
            price,
            is_discount,
            discount_price,
            remark,
            stock,
            color,
            size,
            description,
            category,
            brand } = req.body;

        // Check if required fields exist
        if (!title || !price || !category) {
            return res.status(400).json({
                success: false,
                message: "Missing required fields: title, price, category"
            });
        }

        if (discount_price && discount_price > price) {
            return res.status(400).json({
                success: false,
                message: "Discount price cannot be greater than original price"
            });
        }

        const data = await Product.create({
            title,
            images,
            sort_description,
            price,
            is_discount,
            discount_price,
            remark,
            stock,
            color,
            size,
            description,
            category,
            brand
        });

        return res.status(201).json({  // 201 for creation
            success: true,
            message: "Product created successfully",
            data: data
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            error: error.message,
            message: "Something went wrong while creating product."
        });
    }
}

const getAllProducts = async (req, res) => {
    try {
        const data = await Product.find();

        return res.status(200).json({
            success: true,
            message: "Products list fetched successfully",
            data: data
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            error: error.message,
            message: "Something went wrong while fetching products list."
        });
    }
}

const getSingleProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const data = await Product.findOne({ id });

        return res.status(200).json({
            success: true,
            message: "Product fetched successfully",
            data: data
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            error: error.message,
            message: "Something went wrong while fetching single product."
        });
    }
}

const updateProduct = async (req, res) => {
    try {

        const {
            title,
            images,
            sort_description,
            price,
            is_discount,
            discount_price,
            remark,
            stock,
            color,
            size,
            description,
            category,
            brand } = req.body;

        const updatedData = {
            title,
            images,
            sort_description,
            price,
            is_discount,
            discount_price,
            remark,
            stock,
            color,
            size,
            description,
            category,
            brand
        }

        const { id } = req.params;
        const data = await Product.findByIdAndUpdate(id, updatedData, { new: true });
        
        return res.status(200).json({
            success: true,
            message: "Product updated successfully",
            data: data
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            error: error.message,
            message: "Something went wrong while fetching single product."
        });
    }
}

const deleteProduct = async (req, res) => {
    try {
        
        const {id} = req.params;
        const deleteProduct = await Product.findByIdAndDelete(id);

        return res.status(200).json({
            success: true,
            message: "Data deleted successfully",
            data: deleteProduct
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            error: error.message,
            message: "Something went wrong while deleting product."
        });
    }
}


const productController = {
    createProduct,
    getAllProducts,
    getSingleProduct,
    updateProduct,
    deleteProduct
}

export default productController;
