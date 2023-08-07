import usersModel from "../dao/models/users.model.js";

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
            } else {
                user.status = "incompleto"
            }
            user.documents = docs;
            const userUpdate = await usersModel.findByIdAndUpdate(user._id, user)
            res.json({ status: "success", message: "se actualizaron los documentos" })
        } else {
            res.status(404).send("usuario inexistente")
        }
    } catch {
        console.log(error.message)
        res.status(404).send("error al cargar los documentos")
    }
}