import { tool } from "langchain";
import * as z from "zod";
import { contextDao } from "../../dao/context.dao.js";

export const getMemoryTool = tool(
  async ({ }, config) => {
    const userId = config.configurable.userId;
    const context = await contextDao.readContextByUser({userId})
    return context
  },
  {
    name: "getMemory",
    description: "Retrieves the context description of the user",
    schema: z.object({
      userId: z.string().describe("The Id of the user whose context is to be retrieved."),
    }),
  },
);

export const updateMemoryTool = tool(
  async ({description }:{description:string},config) =>{
    const userId = config.configurable.userId;
    const result = await contextDao.updateContextByUser({ userId, description });
    return result
  },
  {
    name: "updateMemory",
    description: "Overrides the context description for a given user",
    schema: z.object({
      userId: z.string().describe("The Id of the user whose context is to be updated."),
      description: z.string().describe("The new context description for the user"),
    }),
  },
);