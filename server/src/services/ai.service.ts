import { ChatMistralAI } from "@langchain/mistralai";
import { env } from "../config/env.js";
import { AIMessage, createAgent, HumanMessage } from "langchain";
import z from "zod";
import type { MongoMessage } from "../types/chat.js";
import { getMemoryTool, updateMemoryTool } from "./ai/tool.js";

const smallModel = new ChatMistralAI({
  model: "ministral-14b-2512",
  apiKey: env.mistralapikey,
});

export async function getConversationTitle({
  message,
}: {
  message: string;
}): Promise<string> {
  const agent = createAgent({
    model: smallModel,
    responseFormat: z.object({
      title: z
        .string()
        .max(30)
        .describe("The title of the conversation,max 30 characters"),
    }),
    systemPrompt: `You are an assistant that generates a consise title for a conversation based on user's first message.`,
  });

  const response = await agent.invoke({
    messages: [new HumanMessage(message)],
  });

  return response.structuredResponse.title;
}

export async function getStream({
  messages,
  userId,
}: {
  messages: MongoMessage[];
  userId: string;
}): Promise<ReadableStream> {
  const agent = createAgent({
    model: smallModel,
    tools: [getMemoryTool, updateMemoryTool],
    systemPrompt: `Read the memory context to make the conversation more personlized.
                 Mandatory: Update the memory whenever you notice a fact that will be relevant for weeks/months and then respond to the user.

         current userid ${userId}`,
  });

  const stream = await agent.stream(
    {
      messages: messages.map((message) => {
        if (message.author === "user") {
          return new HumanMessage(message.content);
        } else {
          return new AIMessage(message.content);
        }
      }),
    },
    {
      streamMode: "messages",
    },
  );
  return stream;
}
