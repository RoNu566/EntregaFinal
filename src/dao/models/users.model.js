import mongoose from "mongoose";
import { cartCollection } from "./cart.models.js";

const userCollection = "user"
const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    last_name: { type: String, required: true },
    age: { type: Number },
    email: { type: String, required: true },
    password: { type: String, required: true },
    rol: { type: String, enum: ["admin", "user", "premium"], default: "user" },
    cart: { type: [{ cart: { type: mongoose.Schema.Types.ObjectId, ref: cartCollection } }], default: [], },
    documents: { type: [{ name: { type: String, required: true }, reference: { type: String, required: true } }], default: [] },
    last_connection: { type: Date, default: null },
    status: { type: String, required: true, enums: ["completo", "incompleto", "pendiente"], default: "pendiente" },
    avatar: { type: String, default: " " }
});

const usersModel = mongoose.model(userCollection, userSchema);

export default usersModel;