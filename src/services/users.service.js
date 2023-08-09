import usersModel from "../dao/models/users.model.js"
import { transporter } from "../config/email.js"

export async function deleteEmail(email) {
    const emailTemplate = `<div>
    <h1>Cuenta Eliminada</h1>
    <p>Su cuenta ha sido eliminada por desuso</p>
    </div>`

    try {
        const data = await transporter.sendMail({
            from: "rnbackend89@gmail.com",
            to: email,
            subject: "Eliminación de cuenta",
            html: emailTemplate,
        })

    } catch (error) {
        console.log(error)
    }
}

export async function deleteUser(id) {
    const user = await usersModel.findById(id)
    try {
        if (user.rol !== "admin") {
            await usersModel.findByIdAndDelete(id)
        } else {
            console.log("Se han eliminado todos los usuarios inactivos, menos el administrador")
        }
    } catch (error) {
        console.log(error)
    }

}

export async function purchaseEmail(ticket, email) {
    const emailTemplate = `<div>
    <h1>💕 Gracias por su compra 💕</h1>
    <p>Hemos procesado su compra</p>
    <p>Ticket: ${ticket.code}<p>
    <p>Hora: ${ticket.purchase_datetime}<p>
    <p>Importe: $ ${ticket.amount}<p>
    <p>Gracias, vuelva pronto!<p>
    </div>`

    try {

        const data = await transporter.sendMail({
            from: "rnbackend89@gmail.com",
            to: email,
            subject: "Compra realizada!",
            html: emailTemplate,
        })
    } catch (error) {
        console.log(error)
    }
}

export async function deleteProductEmail(email) {
    const emailTemplate = `<div>
    <h1>Eliminación de producto</h1>
    <p>Se ha eliminado su producto</p>
    <p>Qudamos atentos por cualquier inconveniente<p>
    </div>`

    try {
        const data = await transporter.sendMail({
            from: "rnbackend89@gmail.com",
            to: email,
            subject: "Eliminación eliminado",
            html: emailTemplate,
        })

    } catch (error) {
        console.log(error)
    }
}