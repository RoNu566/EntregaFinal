import { ProductManager } from "../config/persistance.js"
import { __dirname } from "../utils.js";
import { ProductErrorFunction } from "../services/errorFunction.js";
import { Logger2 } from "../Logger/logger.js"
import { deleteProductEmail } from "../services/users.service.js";
import usersModel from "../dao/models/users.model.js";


const logger = Logger2()
const manager = new ProductManager();

export const GetProductsController = async (req, res) => {
    try {
        const { limit, page, sort } = req.params;
        const products = await manager.getProducts(limit, page, sort);
        res.send({ status: "success", payload: products });
    } catch (err) {
        logger.fatal("No se pudo obtener la lista de productos")
        ProductErrorFunction();
        res.status(404).send("No se pudo obtener la lista de productos")
    }
}
export const GetProductbyIDController = async (req, res) => {
    try {
        const { pid } = req.params
        const product = await manager.getProductById(pid)
        res.status(201).send(product)
    } catch (err) {
        res.status(404).send("Producto no encontrado")
    }
}

export const AddProductController = async (req, res) => {
    try {
        const title = req.body.title;
        const description = req.body.description;
        const price = Number(req.body.price);
        const thumbnail = req.body.thumbnail;
        const code = Number(req.body.code);
        const stock = Number(req.body.stock);
        const category = req.body.category;
        const status = true;
        const owner = req.session._id;

        const result = await manager.addProduct(title, description, price, thumbnail, code, stock, category, status, owner);
        req.io.emit("new-product", result);
        logger.info("Producto agregado!!")
        res.render("/confirmedcreation");
    } catch (e) {
        logger.error(`No se pudo agregar el producto`)
        res.status(404).send(`No se pudo agregar el producto`);
    }
}

export const UpdateProductController = async (req, res) => {
    try {
        const { pid } = req.params;
        const id = (pid);
        await manager.updateProduct(id, req.body)

        const products = await manager.getProducts()
        req.io.emit("update-product", products)
        res.status(201).send(await manager.getProductById(id))
    } catch (err) {
        logger.error(`No se pudo actualizar el producto`)
        res.status(404).send("No se pudo actualizar el producto")
    }
}

export const DeleteProductByIdController = async (req, res) => {
    try {
        const { pid } = req.params
        const product = await manager.getProductById(pid);
        if (product) {
            if (req.session.rol === "premium" && product.owner == req.session._id) {
                await manager.deleteProduct(pid)
                deleteProductEmail(req.session.email)
                res.send({ status: "succes", message: "Se ha eliminado el producto" })
            } else if (req.session.rol === "admin") {
                const owner = await usersModel.findById(product.owner)
                await manager.deleteProduct(pid)
                deleteProductEmail(owner.email)
                res.send({ status: "succes", message: "Producto eliminado por el administrador" })
            } else {
                res.send({ status: "Error", message: "No tienes autorización para eliminar el producto" })
            }
        }
        const products = await manager.getProducts()
        req.io.emit("delete-product", products);
    } catch (err) {
        res.status(404).send("No se pudo eliminar el producto")
    }
}

export const DeletProductbyformController = async (req, res) => {
    try {
        const { pid } = req.body
        const product = await manager.getProductById(pid);
        if (product) {
            if (req.session.rol === "premium" && product.owner == req.session._id) {
                await manager.deleteProduct(pid)
                deleteProductEmail(req.session.email)
                res.send({ status: "succes", message: "Se ha eliminado el producto" })
            } else if (req.session.rol === "admin") {
                const owner = await usersModel.findById(product.owner)
                await manager.deleteProduct(pid)
                deleteProductEmail(owner.email)
                res.send({ status: "succes", message: "Producto eliminado por el administrador" })
            } else {
                res.send({ status: "Error", message: "No tienes autorización para eliminar el producto" })
            }
        }
        const products = await manager.getProducts()
        req.io.emit("delete-product", products);
    } catch (err) {
        res.status(404).send("No se pudo eliminar el producto")
    }
}


export { manager }