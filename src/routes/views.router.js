import { json, Router } from "express";
import { HomeViewController, RealTimeProdController, ProductViewController, ChatController, LoginViewController, ProfileViewController, SignInViewController, ForgotViewController, loggerViewController, resendPassViewController, purchasConfirmedController, premiumuserController, createproductController, deleteproductController, confirmedcreationController } from "../controllers/views.controller.js";
import { verifyRole } from "../middlewares/auth.roles.js";
import compression from "express-compression";

const viewsRouter = Router()
viewsRouter.use(json())

//Ruta Render Home//
viewsRouter.get("/", HomeViewController);

//Ruta Render Rreal Time Products//
viewsRouter.get("/real-time-products", RealTimeProdController);

//Ruta Render Product//
viewsRouter.get("/products", compression({ brotli: { enable: true, zlib: {} } }), ProductViewController);

//Ruta Render Chat//
viewsRouter.get("/chat", verifyRole(["user"]), ChatController);

//Ruta Render Login//
viewsRouter.get("/login", LoginViewController);

//Ruta Render Profile//
viewsRouter.get("/profile", ProfileViewController);

//Ruta Render Signin//
viewsRouter.get("/signIn", SignInViewController);

//Ruta Render Forgot//
viewsRouter.get("/forgot", ForgotViewController);

viewsRouter.get("/loggerTest", loggerViewController)

viewsRouter.get("/resendpass", resendPassViewController);

//Ruta a view de compra
viewsRouter.get("/purchase_confirmed", purchasConfirmedController)

//Ruta a view de user premium
viewsRouter.get("/premiumuser", premiumuserController)

//Ruta a view de crear producto
viewsRouter.get("/createproduct", verifyRole(["admin", "premium"]), createproductController)

//Ruta a view de eliminar un producto
viewsRouter.get("/deleteproduct", verifyRole(["admin"]), deleteproductController)

//Ruta a view de eliminar un producto
viewsRouter.get("/confirmedcreation", confirmedcreationController)



export default viewsRouter;