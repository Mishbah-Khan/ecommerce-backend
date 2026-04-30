import express from "express";
import brandController from '../controllers/brand.controller.js'



const brandRouter = express.Router();


brandRouter.post('/create-brand', brandController.createBrand);



export default brandRouter;