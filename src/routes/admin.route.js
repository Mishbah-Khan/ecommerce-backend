import express from "express";
import adminController from "../controllers/admin.controller.js";

const adminRouter =  express.Router();

adminRouter.post('/register-admin', adminController.adminRegister);



export default adminRouter;