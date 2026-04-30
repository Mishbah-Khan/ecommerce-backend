import express from "express";
import categoryController from '../controllers/category.controller.js'



const categoryRouter = express.Router();


categoryRouter.post('/create-category', categoryController.createCategory);
categoryRouter.get('/get-all-categories/:per_page/:page_no', categoryController.getAllCategories);
categoryRouter.get('/single-category/:id', categoryController.getSingleCategory);
categoryRouter.put('/update-category/:id', categoryController.updateCategory);
categoryRouter.delete('/delete-category/:id', categoryController.deleteCategory);





export default categoryRouter;