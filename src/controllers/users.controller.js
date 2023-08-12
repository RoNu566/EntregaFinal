import usersModel from "../dao/models/users.model.js";
import { deleteUser, deleteEmail } from "../services/users.service.js";

export const isPremium = async (req, res) => {
    try {
        const userId = req.params.uid;
        const user = await usersModel.findById(userId);
        const userRol = user.rol;

        //validacion de documentos

        if (user.documents.length < 3 && user.status !== "completo") {
            return res.json({ status: "error", message: "No fue posible modificar la membresia, falta entregar documentacion" })
        }
        if (userRol === "user") {
            user.rol = "premium"
        } else if (userRol === "premium") {
            user.rol = "user"
        } else {
            return res.json({ status: "error", message: "No fue posible modificar la membresia" })
        }
        await usersModel.updateOne({ _id: user._id }, user)
        res.send({ status: "succes", message: "Se ha actualizado la membresía" })
    } catch (error) {
        res.status(404).send("No se pudo modificar el tipo de usuario")
    }
}

export const DocumentController = async (req, res) => {
    try {
        const userId = req.params.uid
        const user = await usersModel.findById(userId)
        if (user) {
            const docs = []
            const identificacion = req.files['identificacion']?.[0] || null;
            const domicilio = req.files['domicilio']?.[0] || null;
            const estadoDeCuenta = req.files['estadoDeCuenta']?.[0] || null;
            if (identificacion) {
                docs.push({ name: "identificacion", reference: identificacion.filename })
            }
            if (domicilio) {
                docs.push({ name: "domicilio", reference: domicilio.filename })
            }
            if (estadoDeCuenta) {
                docs.push({ name: "estadoDeCuenta", reference: estadoDeCuenta.filename })
            }
            if (docs.length == 3) { // tengo los 3 docs?
                user.status = "completo"
                user.rol = "premium"
            } else {
                user.status = "incompleto"
            }
            user.documents = docs;
            await usersModel.findByIdAndUpdate(user._id, user)
            res.json({ status: "success", message: "se actualizaron los documentos" })
        } else {
            res.status(404).send("usuario inexistente")
        }
    } catch (error) {
        console.log(error.message)
        res.status(404).send("error al cargar los documentos")
    }
}

export const getlistController = async (req, res) => {
    try {
        const users = await usersModel.find().lean()
        let userList = users.map(p => { return `Nombre: ${p.name}, Apellido: ${p.last_name}, Edad: ${p.age}, Email: ${p.email}, Rol: ${p.rol}` })
        res.status(201).send(userList)
    } catch (error) {
        console.log(error.message)
        res.status(404).send("error al obtener usuarios")
    }

}

export const deleteController = async (req, res) => {
    try {
        const users = await usersModel.find().lean()
        let now = new Date();
        let Tlimit = 1000 * 60 * 60 * 24 * 2
        let aux = now.getTime() - Tlimit
        let limit = new Date(aux)

        let LastUsers = users.filter(aux => (aux.last_connection < limit))
        let userId = LastUsers.map(aux => { return { id: aux._id, email: aux.email } })
        let user_delete = userId.forEach(p => { deleteEmail(p.email), deleteUser(p.id) })
        res.status(201).send("Se han elimina los usuarios con más de 2 horas de inactividad")
    } catch (error) {
        console.log(error.message)
        res.status(404).send("No se pueden eliminar los usuarios")
    }
}