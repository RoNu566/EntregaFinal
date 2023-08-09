import { Router, json, urlencoded } from "express";
import { isPremium, DocumentController, getlistController, deleteController } from "../controllers/users.controller.js";
import { verifyRole, checkAuthenticated } from "../middlewares/auth.roles.js";
import { uploaderDocuments } from "../utils.js";


const usersRouter = Router();
usersRouter.use(json());
usersRouter.use(urlencoded({ extended: true }));

usersRouter.put("/premium/:uid", verifyRole(["admin"]), isPremium);

usersRouter.post("/:uid/documents", checkAuthenticated, uploaderDocuments.fields([{ name: "identificacion", maxCount: 1 }, { name: "domicilio", maxCount: 1 }, { name: "estadoDeCuenta", maxCount: 1 }]), DocumentController)

//Ruta para ver la lista de users//
usersRouter.get("/", verifyRole(["admin"]), getlistController)


//Ruta para eliminar usuarios con +2hrs//
usersRouter.get("/delete", verifyRole(["admin"]), deleteController)

export default usersRouter;