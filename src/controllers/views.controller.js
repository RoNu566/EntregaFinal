import { manager } from "../controllers/products.controller.js"
import ChatManager from "../dao/db-managers/chat.manager.js";
import { cartManager } from "./cart.controller.js";
import { Logger2 } from "../Logger/logger.js";



const chatManager = new ChatManager;
const logger = Logger2()

export const HomeViewController = async (req, res) => {
    const products = await manager.getProducts()
    res.render("home", { products })
}

export const RealTimeProdController = async (req, res) => {
    const products = await manager.getProducts()
    res.render("real-time-products", { products })
}

export const ProductViewController = async (req, res) => {
    const data = req.session
    const { limit, page } = req.query;
    const products = await manager.getProducts(limit, page)
    res.render("products", { products, data, section: "products" })
}

export const ChatController = async (req, res) => {
    try {
        const messages = await chatManager.getMessages();
        res.render("chat", { messages: messages })
    } catch (Err) {
        logger.fatal("No se pudieron obtener los mensajes!")
        // console.log("No se pudieron obtener los mensajes!")
    }
}

export const LoginViewController = async (req, res) => {
    console.log(req.session)
    const data = req.session;
    res.render("login", { data, section: "login" })
}

export const ProfileViewController = async (req, res) => {
    const data = req.session;
    const cartProduct = await cartManager.checkCart(data.cartid)
    res.render("profile", { data, cartProduct, section: "profile" })
}

export const SignInViewController = async (req, res) => {
    res.render("signIn")
}

export const ForgotViewController = async (req, res) => {
    const token = req.query.token
    res.render("forgot", { token })
}

export const loggerViewController = async (req, res) => {
    logger.fatal("prueba fatal")
    logger.error("prueba error")
    logger.warning("prueba warning")
    logger.info("prueba info")
    logger.http("prueba http")
    logger.debug("prueba debug")
    res.send("Fin de la prueba")
}

export const resendPassViewController = async (req, res) => {
    res.render("resendpass")
}

export const purchasConfirmedController = async (req, res) => {
    res.render("purchaseconfirmed")
}

export const premiumuserController = async (req, res) => {
    const data = req.session
    res.render("premiumuser", { data, section: "form" })
}

export const createproductController = async (req, res) => {
    const data = req.session
    res.render("createproduct", { data, section: "createproduct" })
}

export const deleteproductController = async (req, res) => {
    res.render("deleteproduct", { section: "deleteproduct" })
}
