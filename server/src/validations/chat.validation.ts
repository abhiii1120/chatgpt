import { body, param } from "express-validator";

export const sendMessageValidation = [
  body("message").isString().notEmpty().withMessage("Message is required"),
  body("conversationId")
    .optional()
    .isString()
    .withMessage("Conversation id is required")
    .isMongoId()
    .withMessage("conversation id must be a valid mongodb objectid"),
];

export const conversationIdValidation = [
  param("conversationId")
    .isMongoId()
    .withMessage('Conversation ID must be a valid mongodb objectId')
]