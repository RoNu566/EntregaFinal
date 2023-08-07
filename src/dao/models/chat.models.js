import mongoose from "mongoose";

const chatSchema = mongoose.Schema({
    username: { type: String, required: true },
    message: { type: String, required: true },
});

const chatModel = mongoose.model("messages", chatSchema);

export default chatModel;