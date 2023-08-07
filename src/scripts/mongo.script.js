import mongoose from "mongoose";
import productModel from "../dao/models/products.models.js";
import { options } from "../config/options.js";

function ConnectDB() {
    mongoose.connect(options.mongoDB.URL).then((conn) => { console.log("Conectado a la base de datos") })
}
ConnectDB()

const updateProducts = async () => {
    try {
        const adminID = "6494aa0eb29077fa3836d325"; //AdminID
        const result = await productModel.updateMany({}, { $set: { owner: adminID } })
        console.log("result", result)
    } catch (error) {
        console.log(error.message)
    }
}
updateProducts()