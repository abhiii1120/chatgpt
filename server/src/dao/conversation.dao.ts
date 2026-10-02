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

  async findConversationByIdAndUser(user:string,conversationId:string){
        return conversationModel.findOne({_id:conversationId,user}).lean();
  }

  async findConversationsByUser(user:string){
        return conversationModel.find({user}).sort({updatedAt:-1}).lean();
  }
}

export const conversationDao = new ConversationDao();
