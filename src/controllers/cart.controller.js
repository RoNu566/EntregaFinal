import { CartManager } from "../config/persistance.js"
import { manager } from "../controllers/products.controller.js"
import TicketManager from "../dao/db-managers/ticket.manager.js";
import { CartNotFoundErrorFunction } from "../services/errorFunction.js";
import { Logger2 } from "../Logger/logger.js";

const cartManager = new CartManager();
const ticketManager = new TicketManager();
const logger = Logger2()

export const GetCartController = async (req, res) => {
    try {
        let carrito = await cartManager.getCart();
        res.send(carrito);
    } catch (error) {
        logger.info("No se pudieron recuperar los carritos")
        CartNotFoundErrorFunction();
    }
}

export const CreateCartController = async (req, res) => {
    try {
        let carrito = await cartManager.addCart();
        res.send(carrito);
    } catch (error) {
        res.send("Error, no se pudo crear el carrito")
    }

}

export const GetCartByIdController = async (req, res) => {
    let cid = req.params.cid;
    let carrito = await cartManager.checkCart(cid);
    if (!carrito) {
        res.send("Este carrito no existe")
    } else {
        res.send(carrito);
    }
}

export const AddProductToCartController = async (req, res) => {
    const { cid, pid } = req.params;
    try {
        await cartManager.addProductToCart(cid, pid);
        logger.info(`Producto ${pid} agregado al carrito ${cid}`)
        res.status(201).send(`Producto ${pid} agregado al carrito ${cid}`);
    } catch (error) {
        logger.error(`No se pudo agregar producto al carrito`)
        res.status(404).send("No se pudo agregar producto al carrito")
    }
}

export const DeleteProductFromCartController = async (req, res) => {
    try {
        const { cid, pid } = req.params;
        await cartManager.deletProdfromCart(cid, pid);
        res.send({ status: "success", payload: "Se elimino el producto del carrito" })
    } catch (err) {
        res.send({ status: "failed", payload: "No se pudo eliminar el producto del carrito" })
    }
}

export const DeleteCartController = async (req, res) => {
    try {
        const { cid } = req.params;
        await cartManager.deleteCar(cid);
        res.send({ status: "Success", payload: "Se elimino el carrito" })
    } catch (err) {
        res.send({ status: "Failed", payload: "No se ha eliminado el carrito" })
    }

}

export const Purchase = async (req, res) => {
    try {
        const cartId = req.params.cid;
        const cart = await cartManager.checkCart(cartId);
        const ticketProducts = [];
        const rejectedProducts = [];
        if (!cart) {
            res.send("No existe el carrito, por favor genere su carrito primero")
        } else {
            if (!cart.products.length) {
                return res.send("es necesario que agrege productos antes de realizar la compra")
            } else {
                for (let i = 0; i < cart.products.length; i++) {
                    const cartProduct = cart.products[i];
                    const productDB = await manager.getProductById(cartProduct.product._id);
                    //comparar la cantidad de ese producto en el carrito con el stock del producto
                    if (cartProduct.quantity <= productDB.stock) {
                        ticketProducts.push(cartProduct);
                    } else {
                        rejectedProducts.push(cartProduct);
                    }
                }
                console.log("ticketProducts", ticketProducts)
            }
            const NewTicket = await ticketManager.newTicket(ticketProducts, req.session.email.toString())
            logger.info(`Ticket Final: ${NewTicket}`)
            // console.log("ticketfinal", NewTicket)
            res.send(NewTicket)
        }
    } catch (err) {
        logger.info(`No se pudo realizar la compra`)
        res.send({ status: "Error", payload: "No se pudo realizar la compra" })
    }
}
