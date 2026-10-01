import { Router } from "express";
import { sendMessageValidation } from "../validations/chat.validation.js";
import { validateRequest } from "../validations/validate-request.js";
import { asyncHandler } from "../middlewares/asyncHandler.js";
import { chatController } from "../controllers/chat.controller.js";
import { authUserMiddleware } from "../middlewares/auth-user.js";

const chatRouter = Router();

chatRouter.post("/conversation",sendMessageValidation,validateRequest,authUserMiddleware,asyncHandler(chatController))

export { chatRouter };
