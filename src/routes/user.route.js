import express from "express";
import userController from "../controllers/user.controller.js";


const userRouter = express.Router();


userRouter.post('/user-register', userController.userRegister);

userRouter.post('/user-login', userController.userLogin);

export default userRouter;