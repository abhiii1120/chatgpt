import { Router } from "express";
import {
  conversationIdValidation,
  sendMessageValidation,
} from "../validations/chat.validation.js";
import { validateRequest } from "../validations/validate-request.js";
import { asyncHandler } from "../middlewares/asyncHandler.js";
import {
  chatController,
  getConversation,
  listConversation,
} from "../controllers/chat.controller.js";
import { authUserMiddleware } from "../middlewares/auth-user.js";

const chatRouter = Router();

chatRouter.get(
  "/conversations",
  authUserMiddleware,
  asyncHandler(listConversation),
);
chatRouter.get(
  "/conversations/:conversationId",
  authUserMiddleware,
  conversationIdValidation,
  validateRequest,
  asyncHandler(getConversation),
);

chatRouter.post(
  "/conversation",
  sendMessageValidation,
  validateRequest,
  authUserMiddleware,
  asyncHandler(chatController),
);

export { chatRouter };
