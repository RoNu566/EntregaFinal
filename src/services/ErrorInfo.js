export const CreateUserError = (user) => {
    return `Faltan campos para crear usuario
    Ten en cuenta que:
    email: debe ser de tipo string, pero has ingresado ${user.email},
    Nombre: debe ser de tipo string, pero has ingresado ${user.first_name},
    Apellido: debe ser de tipo string, pero has ingresado ${user.last_name},
    Age: email: debe ser de tipo Number, pero has ingresado ${user.age},
    `
}

export const LoginError = (user) => {
    return `Falta informacion para el Login
    Ten en cuenta que:
    email: debe ser de tipo string, pero has ingresado ${user.email},
    password: debe ser de tipo string, pero has ingresado ${user.password},
    `
}

export const PasswordError = () => {
    return `Usuario o contraseña incorrecto.`
}

export const ProductError = () => {
    return `Ha ocurrido un error al intentar descargar los productos`
}

export const CartNotFoundErrorInfo = () => {
    return `No se encuentra tu carrito`
}