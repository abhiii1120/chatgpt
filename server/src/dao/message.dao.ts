import { type Message, type MongoMessage } from './../types/chat.js';
import { messageModel, type messageDocument } from './../models/message.model.js';

class MessageDao {

    async createMessage(messageData:Message) : Promise<messageDocument>{
        let {content,author,conversation} = messageData;

        const message = await messageModel.create({content,author,conversation});
        return message
    }

    async findMessagesByConversation(conversation:string):Promise<MongoMessage[]>{
        return (await messageModel.find({conversation}).sort({createdAt:1}).lean()).map((message) => ({
            _id:message._id.toString(),
            content:message.content,
            author:message.author,
            conversation:message.conversation.toString(),
            createdAt:message.createdAt,
            updatedAt:message.updatedAt
        }));
    }
}

export const messageDao = new MessageDao();