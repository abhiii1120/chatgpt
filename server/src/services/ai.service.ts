import { ChatMistralAI } from "@langchain/mistralai";
import { env } from "../config/env.js";
import { createAgent, HumanMessage } from "langchain";
import z from "zod";

const smallModel = new ChatMistralAI({
    model:'ministral-14b-2512',
    apiKey:env.mistralapikey,
})

const mediumModel = new ChatMistralAI({
    model:'ministral-14b-2512',
    apiKey:env.mistralapikey
})

export async function getConversationTitle({message}:{message:string}) : Promise<string> {
    const agent = createAgent({
        model:smallModel,
        responseFormat:z.object({
            title:z.string().max(30).describe('The title of the conversation,max 30 characters')
        }),
        systemPrompt:`You are an assistant that generates a consise title for a conversation based on user's first message.`
    })

    const response = await agent.invoke({
        messages:[
            new HumanMessage(message)
        ]
    })

    return response.structuredResponse.title
}

export async function getStream({message}:{message:string}): Promise<ReadableStream>{
    const stream = await mediumModel.stream(message);
    return stream;
}