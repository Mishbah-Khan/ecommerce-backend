import express from "express";
import userController from "../controllers/user.controller.js";
import userValidation from "../middlewares/user.middleware.js";

const userRouter = express.Router();


userRouter.post('/user-register', userController.userRegister);

userRouter.post('/user-login', userController.userLogin);

userRouter.get('/user-profile', userValidation , userController.userProfile);

userRouter.get('/user-verify', userValidation , userController.userVerify);

userRouter.put('/user-update', userValidation , userController.userUpdate);

userRouter.get('/user-logout', userValidation , userController.userLogout);

export default userRouter;