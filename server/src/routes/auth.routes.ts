import { Router } from "express";
import { loginValidation, registerValidation } from "../validations/auth.validation.js";
import { validateRequest } from "../validations/validate-request.js";
import { asyncHandler } from "../middlewares/asyncHandler.js";
import { login, logout, refresh, register } from "../controllers/auth.controller.js";

const authRouter = Router();

authRouter.post('/register',registerValidation,validateRequest,asyncHandler(register));

authRouter.post('/login',loginValidation,validateRequest,asyncHandler(login));

authRouter.post('/refresh',refresh);
authRouter.post('/logout',logout);

export default authRouter;
