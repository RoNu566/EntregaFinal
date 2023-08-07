import { CustomError } from "./customError.service.js";
import { EError } from "../enums/EError.js";
import { CreateUserError, LoginError, PasswordError, ProductError, CartNotFoundErrorInfo } from "../services/ErrorInfo.js"

export const LoginErrorFunction = (info) => {
    CustomError.createError({
        name: "Error de Login",
        cause: LoginError(info),
        message: "Error al hacer login",
        errorCode: EError.INVALID_JSON
    })
}

export const PasswordErrorFunction = () => {
    CustomError.createError({
        name: "Error de autentificación",
        cause: PasswordError(),
        message: "Error de usuario y/o contraseña",
        errorCode: EError.AUTH_ERROR
    })
}

export const CreateUserErrorFunction = (info) => {
    CustomError.createError({
        name: "Error al crear usuario",
        cause: CreateUserError(info),
        message: "Error al crear usuario",
        errorCode: EError.INVALID_JSON
    })
}

export const ProductErrorFunction = () => {
    CustomError.createError({
        name: "Error al intentar recuperar los productos",
        cause: ProductError(),
        message: "Error al intentar recuperar los productos",
        errorCode: EError.DB_ERROR
    })
}

export const CartNotFoundErrorFunction = () => {
    CustomError.createError({
        name: "Recuperar carritos",
        cause: CartNotFoundErrorInfo(),
        message: "No se pudo recuperar los carritos",
        errorCode: EError.DB_ERROR
    })
}