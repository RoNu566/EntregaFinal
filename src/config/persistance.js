import FileProductManager from "../dao/file-managers/product.manager.js"
import FileCartManager from "../dao/file-managers/cart.manager.js"
import DbProductManager from "../dao/db-managers/product.manager.js"
import DbCartManager from "../dao/db-managers/cart.manager.js"
import { options } from "./options.js"
import mongoose from "mongoose"

const config = {
    persistanceType: options.server.persistance,
    env: options.mongoDB.ENV
}

let ProductManager, CartManager;

if (config.persistanceType === "DB") {
    ProductManager = DbProductManager;
    CartManager = DbCartManager;
    if (config.env == "production") {
        try {
            mongoose.connect(options.mongoDB.URL).then((conn) => { console.log("Conected to Db") });
        } catch (error) {
            console.log("error al conectarse a la base de datos")
        }
    } else {
        try {
            mongoose.connect(options.mongoDB.TESTING).then((conn) => { console.log("Conected to test DB") });
        } catch (error) {
            console.log("error al conectarse a la base de prueba")
        }
    }
} else if (config.persistanceType === "File") {
    ProductManager = FileProductManager;
    CartManager = FileCartManager;
} else {
    throw new Error("Tipo de Persistencia desconocida");
}

export { ProductManager, CartManager }

