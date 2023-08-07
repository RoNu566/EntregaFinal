import { EError } from "../enums/EError.js";

export const errorHandler = (error, req, res, next) => {
    switch (error.code) {
        case EError.ROUTING_ERROR:
            res.json({ status: "Error", error: error.cause })
            break;
        case EError.DB_ERROR:
            res.json({ status: "Error", error: error.cause })
            break;
        case EError.INVALID_JSON:
            res.json({ status: "Error", error: error.cause })
            break;
        case EError.AUTH_ERROR:
            res.json({ status: "Error", error: error.cause })
            break;
        default:
            res.json({ status: "error", message: "Hubo un error" })
            break;
    }
}