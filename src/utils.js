import path from "path";
import { fileURLToPath } from "url";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"
import { options } from "./config/options.js";
import multer from "multer";


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const hashPassword = (password) => {
    return bcrypt.hashSync(password, bcrypt.genSaltSync());
}

const validatePassword = (user, loginPasword) => {
    return bcrypt.compareSync(loginPasword, user.password);
}

const emailToken = (email, expireTime) => {
    const token = jwt.sign({ email }, options.server.secretSession, { expiresIn: expireTime });
    return token
}

const verifyToken = (token) => {
    try {
        const info = jwt.verify(token, options.server.secretSession)
        return info.email
    } catch (error) {
        console.log(error.message)
        return null
    }
}

const isValidFields = (body) => {
    const { name, email, password } = body;
    if (!name || !email || !password) {
        return false
    } else {
        return true
    }
};

//Validar los campos antes de cargar la imagen

const multerFilter = (req, file, cb) => {
    const isValidData = isValidFields(req.body)
    if (!isValidData) {
        cb(null, false)
    } else {
        cb(null, true)
    }
};

//guardar imagenes de usuarios//

const profileStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, "/files/users/images"))
    },
    //nombre del archivo//
    filename: function (req, file, cb) {
        cb(null, `${req.body.email}-perfil-${file.originalname}`)
    }
});

//para subir las imagenes//

export const uploaderProfile = multer({ storage: profileStorage, fileFilter: multerFilter });

//guardar los documentos//

const documentStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, "/files/users/documents"))
    },
    //nombre del archivo//
    filename: function (req, file, cb) {
        cb(null, `${req.session.email}-documento-${file.originalname}`)
    }
});
//crear uploader de documentos//

export const uploaderDocuments = multer({ storage: documentStorage });

// guardar imagenes de productos//

const productStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, "/files/products/images"))
    },
    //nombre del archivo//
    filename: function (req, file, cb) {
        cb(null, `${req.body.title}-imagen-${file.originalname}`)
    }
});
//crear uploader de documentos//

export const uploaderProduct = multer({ storage: productStorage });


export { __dirname, hashPassword, validatePassword, emailToken, verifyToken };

