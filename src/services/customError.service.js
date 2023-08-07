export class CustomError {
    static createError({ name = "Error", cause, message, errorCode }) {
        const error = new Error(message, { cause })
        error.name = name;
        error.code = errorCode;
        console.log("error", { mensaje: error.message, cause: error.cause, code: error.code })
        throw error
    }
}