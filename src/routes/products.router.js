import { json, Router } from "express";
import { GetProductsController, GetProductbyIDController, AddProductController, UpdateProductController, DeleteProductByIdController, DeletProductbyformController } from "../controllers/products.controller.js";
import { verifyRole } from "../middlewares/auth.roles.js";
import compression from "express-compression";
import { uploaderProduct } from "../utils.js";

const productsRouter = Router()
productsRouter.use(json())

//Ruta para obtener productos//
productsRouter.get("/", compression({ brotli: { enable: true, zlib: {} } }), GetProductsController);

//Ruta para obtener productos por ID//
productsRouter.get("/:pid", GetProductbyIDController);

//Ruta para crear productos//
productsRouter.post("/", verifyRole(["admin", "premium"]), uploaderProduct.single("thumbnail"), AddProductController);

//Ruta para actualizar productos//
productsRouter.put("/:pid", verifyRole(["admin"]), UpdateProductController)

//Ruta para eliminar productos por id//
productsRouter.delete("/:pid", verifyRole(["admin", "premium"]), DeleteProductByIdController)

//Ruta para eliminar productos por id con formulario//
productsRouter.post("/delete", DeletProductbyformController)

export default productsRouter;

