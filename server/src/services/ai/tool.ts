import { tool } from "langchain";
import * as z from "zod";
import { contextDao } from "../../dao/context.dao.js";
import { getResultFromWeb } from "../web.service.js";

export const getMemoryTool = tool(
  async ({}, config) => {
    const userId = config.configurable.userId;
    const context = await contextDao.readContextByUser({ userId });
    return context;
  },
  {
    name: "getMemory",
    description: "Retrieves the context description of the user",
    schema: z.object({
      userId: z
        .string()
        .describe("The Id of the user whose context is to be retrieved."),
    }),
  },
);

export const updateMemoryTool = tool(
  async ({ description }: { description: string }, config) => {
    const userId = config.configurable.userId;
    const result = await contextDao.updateContextByUser({
      userId,
      description,
    });
    return result;
  },
  {
    name: "updateMemory",
    description: "Overrides the context description for a given user",
    schema: z.object({
      userId: z
        .string()
        .describe("The Id of the user whose context is to be updated."),
      description: z
        .string()
        .describe("The new context description for the user"),
    }),
  },
);

export const getWebResultTool = tool(
  async ({ query }: { query: string }, config) => {
    const result = await getResultFromWeb({ query });
    return result;
  },
  {
    name: "getWebResult",
    description: "Searches the web for a given query and returns the result.",
    schema: z.object({
      query: z.string().describe("The searches query to look up on the web."),
    }),
  },
);
