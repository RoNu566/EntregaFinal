import { CartManager } from "../config/persistance.js"
import TicketManager from "../dao/db-managers/ticket.manager.js";
import { CartNotFoundErrorFunction } from "../services/errorFunction.js";
import { Logger2 } from "../Logger/logger.js";
import { purchaseEmail } from "../services/users.service.js";


export const cartManager = new CartManager();
export const ticketManager = new TicketManager();
const logger = Logger2();


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
        res.redirect("/products");
    } catch (error) {
        logger.error(`No se pudo agregar producto al carrito`)
        res.status(404).send("No se pudo agregar producto al carrito")
    }
}

export const DeleteProductFromCartController = async (req, res) => {
    try {
        const { cid, pid } = req.params;
        await cartManager.deletProdfromCart(cid, pid);
        logger.info("Se elimino el producto del carrito")
        res.redirect("/profile")
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

export const PurchaseController = async (req, res) => {
    try {
        const cartId = req.params.cid;
        const cartPurchase = await cartManager.purchase(cartId)
        const NewTicket = await ticketManager.newTicket(cartPurchase, req.session.email.toString())
        logger.info(`Ticket Final: ${NewTicket}`)
        purchaseEmail(NewTicket, req.session.email.toString())
        res.redirect("/purchase_confirmed")
    } catch (err) {
        logger.info(`No se pudo realizar la compra`)
        res.send({ status: "Error", payload: "No se pudo realizar la compra" })
    }
}

export const emptycartController = async (req, res) => {
    try {
        const cartId = req.params.cid;
        cartManager.emptycart(cartId);
        logger.info("Se ha vaciado el carrito")
        res.redirect("/profile")
    } catch (error) {
        logger.error("No se pudo vaciar el carrito")
        res.status(404).send("No se pudo vaciar el carrito")
    }
}
