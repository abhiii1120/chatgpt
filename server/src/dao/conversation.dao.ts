import {
  conversationModel,
  type ConversationDocument,
} from "../models/conversation.model.js";

class ConversationDao {
  async createConversation(input: {
    title: string;
    userId: string;
  }): Promise<ConversationDocument> {
    const conversation = await conversationModel.create({
      title: input.title,
      user: input.userId,
    });
    return conversation;
  }
}

export const conversationDao = new ConversationDao();
