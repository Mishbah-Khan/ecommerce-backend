import express from "express";
import adminController from "../controllers/admin.controller.js";
import adminValidation from "../middlewares/admin.middleware.js";

const adminRouter =  express.Router();

adminRouter.post('/admin-register', adminController.adminRegister);
adminRouter.post('/admin-login', adminController.adminLogin);
adminRouter.get('/admin-profile', adminValidation , adminController.adminProfile);
adminRouter.get('/admin-verify', adminValidation , adminController.adminVerify);
adminRouter.put('/admin-update', adminValidation,  adminController.adminUpdate);
adminRouter.get('/admin-logout', adminValidation,  adminController.adminLogout);



export default adminRouter;