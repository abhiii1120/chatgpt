import { type Message } from './../types/chat.js';
import { messageModel, type messageDocument } from './../models/message.model.js';

class MessageDao {

    async createMessage(messageData:Message) : Promise<messageDocument>{
        let {content,author,conversation} = messageData;

        const message = await messageModel.create({content,author,conversation});
        return message
    }

    async findMessagesByConversation(conversation:string){
        return  messageModel.find({conversation}).sort({createdAt:1}).lean();
    }
}

export const messageDao = new MessageDao();