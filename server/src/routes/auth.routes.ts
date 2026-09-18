import { Router } from "express";
import { loginValidation, registerValidation } from "../validations/auth.validation.js";
import { validateRequest } from "../validations/validate-request.js";
import { asyncHandler } from "../middlewares/asyncHandler.js";
import { login, register } from "../controllers/auth.controller.js";

const authRouter = Router();

authRouter.post('/register',registerValidation,validateRequest,asyncHandler(register));

authRouter.post('/login',loginValidation,validateRequest,asyncHandler(login));

export default authRouter;
