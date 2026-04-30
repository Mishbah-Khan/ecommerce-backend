import Category from "../models/Category.model.js";
const createCategory = async (req, res) => {
    try {

        const { name , slug } = req.body;

        // Check if required fields exist
        if (!name) {
            return res.status(400).json({
                success: false,
                message: "Missing required field: Category Name"
            });
        }

        // Check if category already exists
        const existingAdmin = await Category.findOne({ name });
        if (existingAdmin) {
            return res.status(400).json({
                success: false,
                message: "Category already exists"
            });
        }

        const data =  await Category.create({ name , slug });

        return res.status(201).json({
            success: true,
            message: "Category created successfully",
            data: data
        });
        
    } catch (error) {
          return res.status(500).json({
            success: false,
            error: error.message,
            message: "Something went wrong while creating category."
        });
    }
}

const getAllCategories = async (req, res) => {
    try {
        const page_no = Number(req.params.page_no);      
        const per_page = Number(req.params.per_page);   
        const skipItem = (page_no - 1) * per_page;
        const sortStage = { createdAt: -1 };

        const joinWithProduct = {
            $lookup: {
                from: "products",
                localField: "category_id",
                foreignField: "_id",
                as: "products",
            },
        };

        const productCount = {
            $addFields: {
                totalProducts: [{ $size: "$products" }]
            }
        }

        const facetStage = {
            $facet: {
                totalCount: [{ $count: "count" }],
                categories: [
                    { $sort: sortStage },
                    { $skip: skipItem },
                    { $limit: per_page },
                    joinWithProduct,
                    productCount,
                    {
                        $project: {
                            updatedAt: 0,
                            products: 0
                        }
                    }
                ],
                
            }
        };

        const data = await Category.aggregate([facetStage]);

        return res.status(200).json({
            success: true,
            message: "Category list fetched successfully",
            data: data,
            
        });



    } catch (error) {
        return res.status(500).json({
            success: false,
            error: error.message,
            message: "Something went wrong while fetching category list."
        });
    }
}

const getSingleCategory =  async (req, res) => {
    try {

        const {id} = req.params;

        const data = await Category.findById(id);

        return res.status(200).json({
            success: true,
            data: data
        });
        
    } catch (error) {
        return res.status(500).json({
            success: false,
            error: error.message,
            message: "Something went wrong while fetching category."
        });
    }
}

const updateCategory = async (req, res) => {
    try {
        const {id} = req.params;
        const {name, slug} = req.body;
        const updateData = { name, slug }
        const data = await Category.findByIdAndUpdate(id, updateData, {new:true});

        return res.status(200).json({
            success: true,
            message: "Category updated successfully",
            data: data
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            error: error.message,
            message: "Something went wrong while updating category."
        });
    }
}

const deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;

        const findData = await Category.findById(id);

        if (!findData) {
            return res.status(204).json({
                success: false,
                message: "No Content"
            });
        }

        const data = await Category.findByIdAndDelete(id);

        return res.status(200).json({
            success: true,
            message: "Category deleted successfully",
            data: data
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            error: error.message,
            message: "Something went wrong while deleting category."
        });
    }

}

const brandController = {
    createCategory,
    getAllCategories,
    getSingleCategory,
    updateCategory,
    deleteCategory
}
export default brandController;