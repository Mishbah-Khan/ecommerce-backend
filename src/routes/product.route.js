import express from "express";
import productController from '../controllers/product.controller.js'
import multer from "multer";


const productRouter = express.Router();
const upload = multer();

productRouter.post(
  '/create-product',
  upload.none(), // important for form-data without file
  productController.createProduct
);

productRouter.get('/get-all-products', productController.getAllProducts);
productRouter.get('/single-product/:id', productController.getSingleProduct);
productRouter.put('/update-product/:id', productController.updateProduct);
productRouter.delete('/delete-product/:id', productController.deleteProduct);



export default productRouter;