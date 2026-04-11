import express from "express";
import productController from '../controllers/product.controller.js'
import multer from "multer";
import adminValidation from "../middlewares/admin.middleware.js";


const productRouter = express.Router();
const upload = multer();

productRouter.post(
  '/create-product', adminValidation,
  productController.createProduct
);

productRouter.get('/get-all-products/:page_no/:per_page/:category/:brand/:remark/:keyword', productController.getAllProducts);

productRouter.get('/single-product/:id', adminValidation, productController.getSingleProduct);
productRouter.put('/update-product/:id', adminValidation, productController.updateProduct);
productRouter.delete('/delete-product/:id', adminValidation, productController.deleteProduct);




export default productRouter;