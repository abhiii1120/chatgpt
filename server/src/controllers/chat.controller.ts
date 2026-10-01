import type { Request, Response } from "express";
import type { RequestMessage } from "../types/chat.js";

export const chatController = async (req:Request<{},{},RequestMessage>,res:Response) => {

    const {message,conversationId} = req.body;

    
}