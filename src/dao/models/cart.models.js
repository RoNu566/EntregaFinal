import mongoose from "mongoose";

export const cartCollection = "carts"

const cartSchema = new mongoose.Schema({
    products: {
        type: [{
            product: { type: mongoose.Schema.Types.ObjectId, ref: "products" },
            quantity: { type: Number, default: 1 }
        }], default: [],
    }
});


cartSchema.pre("findOne", function () {
    this.populate("products.product")
})

const cartModel = mongoose.model(cartCollection, cartSchema);
export default cartModel;