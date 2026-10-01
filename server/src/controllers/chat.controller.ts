import type { Request, Response } from "express";
import type { RequestMessage } from "../types/chat.js";
import { getConversationTitle, getStream } from "../services/ai.service.js";
import unauthorizedError from "../utils/errors/unauthorized.js";
import { conversationDao } from "../dao/conversation.dao.js";

export const chatController = async (req:Request<{},{},RequestMessage>,res:Response) => {

    let {message,conversationId} = req.body;
    const user = req.user;

    if(!user){
        throw new unauthorizedError('Unauthorized access');
    }

    if(!conversationId){

        let title = await getConversationTitle({message});
        const newConversation = await conversationDao.createConversation({
            title,
            userId:user.userId,
        })

        conversationId = newConversation._id.toString()
    }

    const stream = await getStream({message});

    res.setHeader("Content-Type","text/event-stream");
    res.setHeader("Cache-Control","no-cache");
    res.setHeader("Connection","keep-alive");

    for await (const chunk of stream){
        res.write(`data: ${chunk.text}\n\n`)
    }

    res.end();
}