import type { Request, Response } from "express";
import type { RequestMessage } from "../types/chat.js";
import { getConversationTitle, getStream } from "../services/ai.service.js";
import unauthorizedError from "../utils/errors/unauthorized.js";
import { conversationDao } from "../dao/conversation.dao.js";
import { messageDao } from "../dao/message.dao.js";
import notFound from "../utils/errors/notFound.js";
import { AIMessage, AIMessageChunk, ToolMessage, type HumanMessage } from "langchain";

/**
 * @GET /api/vi/chat/conversations
 * this api returns all the conversation's title of the current logged in user.
 */
export const listConversation = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const user = req.user;
  if (!user) {
    throw new unauthorizedError("unauthorized access");
  }

  const conversations = await conversationDao.findConversationsByUser(
    user.userId,
  );

  res.status(200).json({
    conversations: conversations.map((conversation) => ({
      id: conversation._id.toString(),
      title: conversation.title,
      createdAt: conversation.createdAt,
      updatedAt: conversation.updatedAt,
    })),
  });
};

/**
 * @GET /api/vi/chat/conversations/:conversationId
 * this api returns all messages of particular conversation
 */
export const getConversation = async (req: Request, res: Response) => {
  const user = req.user;
  if (!user) {
    throw new unauthorizedError("Unauthorized error");
  }
  console.log(req.params.conversationId, user.userId);

  const conversation = await conversationDao.findConversationByIdAndUser(
    String(req.params.conversationId),
    user.userId,
  );

  if (!conversation) {
    throw new notFound("Conversation not found");
  }

  const messages = (await messageDao.findMessagesByConversation(conversation._id.toString())).filter((message) => message.author === "user" || (message.author === "ai" && message.toolCalls?.length === 0));

  res.status(200).json({
    conversation: {
      id: conversation._id.toString(),
      title: conversation.title,
      createdAt: conversation.createdAt,
      updatedAt: conversation.updatedAt,
      messages: messages.map((message) => ({
        id: message._id.toString(),
        author: message.author,
        content: message.content,
        createdAt: message.createdAt,
      })),
    },
  });
};

/**
 * @POST /api/v1/chat/conversation
 *
 * req.body{
 *      message:string,
 *      conversationId?:string,
 * }
 */
export const chatController = async (
  req: Request<{}, {}, RequestMessage>,
  res: Response,
) => {
  let { message, conversationId } = req.body;
  let conversationTitle: string;
  const user = req.user;

  if (!user) {
    throw new unauthorizedError("Unauthorized access");
  }

  if (!conversationId) {
    conversationTitle = await getConversationTitle({ message });
    const newConversation = await conversationDao.createConversation({
      userId: user.userId,
      title: conversationTitle,
    });
    conversationId = newConversation._id.toString();
  } else {
    const conversation = await conversationDao.findConversationByIdAndUser(
      conversationId,
      user.userId,
    );
    if (!conversation) {
      throw new notFound("Conversation not found");
    }
    conversationTitle = conversation.title;
  }

  await messageDao.createMessage({
    content: message,
    author: "user",
    conversation: conversationId,
  });
  const messages = await messageDao.findMessagesByConversation(conversationId)

  const stream = await getStream({ messages, userId: user.userId });

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.setHeader("X-Conversation-Id", conversationId);
  res.setHeader("X-Conversation-Title", encodeURIComponent(conversationTitle));

  let aiMessage: string = "";

  for await (const [mode, data] of stream) {
    console.log(mode,data)
    if (mode === "messages") {
      const [token, metadata] = data;

      if (token.getType() === "ai") {
        res.write(`data: ${JSON.stringify(token.text)}\n\n`);
        aiMessage += token.text;
      }
    } else if (mode === "values") {
      console.log("received values:", data);

      const currentStateMessages : (HumanMessage | AIMessage | ToolMessage)[] = data.messages;

      const newMessage = currentStateMessages.at(-1);

      if(newMessage instanceof AIMessageChunk){
        await messageDao.createMessage({
          content:newMessage.text || "no content",
          author:'ai',
          conversation:conversationId,
          toolCalls: newMessage.tool_calls ? newMessage.tool_calls.map((call) => {
            return {
              arguments:call.args,
              id:call.id ?? "",
              name:call.name
            }
          }) : []
        })
      } else if (newMessage instanceof ToolMessage){
        await messageDao.createMessage({
          content:newMessage.text,
          author:'tool',
          conversation:conversationId,
          toolCallId:newMessage.tool_call_id
        })
      }
    }
  }

  res.end();
};
