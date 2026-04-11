import mongoose from "mongoose";
import Product from "../models/Product.model.js";
const ObjectId = mongoose.Types.ObjectId;
const createProduct = async (req, res) => {
    try {
        const {
            title,
            sort_description,
            price,
            is_discount,
            discount_price,
            remark,
            stock,
            color,
            size,
            description,
            category_id,
            brand_id } = JSON.parse(req.body.data);

            const imgUrl = req.file ? req.file.path : null;

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
            images:imgUrl,
            sort_description,
            price,
            is_discount,
            discount_price,
            remark,
            stock,
            color,
            size,
            description,
            category_id,
            brand_id
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
        const page_no = Number(req.params.page_no);      
        const per_page = Number(req.params.per_page);    
        const category_id = req.params.category;       
        const brand_id = req.params.brand;
        const remark = req.params.remark; 
        const keyword = req.params.keyword;

        // Validate pagination parameters
        if (isNaN(page_no) || isNaN(per_page) || page_no < 1 || per_page < 1) {
            return res.status(400).json({
                success: false,
                message: "Invalid pagination parameters"
            });
        }

        const skipItem = (page_no - 1) * per_page;
        const sortStage = { createdAt: -1 };
        
        // Build match conditions dynamically
        let matchConditions = {};
        
        if (category_id && category_id !== '0') {
            matchConditions.category_id = new ObjectId(category_id);
        }
        if (brand_id && brand_id !== '0') {
            matchConditions.brand_id = new ObjectId(brand_id);
        }
        if (remark && remark !== '0') {
            matchConditions.remark = remark;
        }
        if (keyword && keyword !== '0') {
            matchConditions.title = { $regex: keyword, $options: "i" };
        }

        const MatchingStage = { $match: matchConditions };

        const joinWithCategory = {
            $lookup: {
                from: "categories",
                localField: "category_id",
                foreignField: "_id",
                as: "category",
            },
        };

        const facetStage = {
            $facet: {
                totalCount: [{ $count: "count" }],
                products: [
                    { $sort: sortStage },
                    { $skip: skipItem },
                    { $limit: per_page },
                    joinWithCategory,
                ]
            }
        };

        const result = await Product.aggregate([MatchingStage, facetStage]);
        
        const totalCount = result[0]?.totalCount[0]?.count || 0;
        const products = result[0]?.products || [];

        return res.status(200).json({
            success: true,
            message: "Products list fetched successfully",
            data: products,
            pagination: {
                currentPage: page_no,
                perPage: per_page,
                totalItems: totalCount,
                totalPages: Math.ceil(totalCount / per_page)
            }
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
        const data = await Product.findById(id);

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
