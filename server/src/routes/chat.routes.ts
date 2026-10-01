import { Router } from "express";
import { sendMessageValidation } from "../validations/chat.validation.js";
import { validateRequest } from "../validations/validate-request.js";

const chatRouter = Router();

chatRouter.post("/conversation",sendMessageValidation,validateRequest)

export { chatRouter };
