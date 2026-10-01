import { body } from "express-validator";

export const sendMessageValidation = [
  body("message").isString().notEmpty().withMessage("Message is required"),
  body("conversationId")
    .optional()
    .isString()
    .withMessage("Conversation id is required")
    .isMongoId()
    .withMessage("conversation id must be a valid mongodb objectid"),
];
