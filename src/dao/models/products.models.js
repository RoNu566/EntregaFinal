import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2"

const productSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    thumbnail: { type: Array, default: [] },
    code: { type: Number, required: true, unique: true },
    stock: { type: Number, required: true },
    category: { type: String, required: true },
    status: { type: Boolean, default: true },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
});

productSchema.plugin(mongoosePaginate);

const productModel = mongoose.model("products", productSchema);
export default productModel;