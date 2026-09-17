import { Router } from "express";
import { registerValidation } from "../validations/auth.validation.js";
import { validateRequest } from "../validations/validate-request.js";
import { asyncHandler } from "../middlewares/asyncHandler.js";
import { register } from "../controllers/auth.controller.js";

const authRouter = Router();

authRouter.post('/register',registerValidation,validateRequest,asyncHandler(register))

export default authRouter;
