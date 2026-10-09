import { contextModel, type ContextDocument } from "../models/context.model.js";

class ContextDao {
  /**
   * Reads the context description of the provided user
   * @param userId - id of the user
   * @returns the description if found , else return default message
   */
  async readContextByUser({userId}:{userId: string}): Promise<string> {
    const contextDoc: ContextDocument | null = await contextModel
      .findOne({ user:userId })
      .lean();
    if (contextDoc) {
      return contextDoc.description;
    } else {
      return "No Context found for the user";
    }
  }

  /**
   * Updates the context description  for a given user. If the context does not exist , it creates a new one.
   * @param userId - id of the user
   * @param description - the new context description
   * @returns A success message
   */
  async updateContextByUser({
    userId,
    description,
  }: {
    userId: string;
    description: string;
  }): Promise<string> {
    const contextDoc: ContextDocument | null =
      await contextModel.findOneAndUpdate(
        { user:userId },
        { description },
        { new: true, upsert: true },
      );

    return "Context updated Successfully";
  }
}

export const contextDao = new ContextDao();
