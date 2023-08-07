import chatModel from "../models/chat.models.js";

class ChatManager {

    async getMessages() {
        try {
            const message = await chatModel.find().lean();
            return message;
        } catch (Err) {
            throw new Error;
        }
    }

    async newMessage(message) {
        try {
            const newMessage = await chatModel.create(message);
            const messages = await this.getMessages();
            return messages;
        } catch (Err) {
            return ("Error al enviar el mensaje!")
        }
    }
}

export default ChatManager;