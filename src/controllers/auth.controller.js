import usersModel from "../dao/models/users.model.js";
import { hashPassword, validatePassword, emailToken, verifyToken } from "../utils.js";
import passport from "passport";
import { LoginErrorFunction, PasswordErrorFunction } from "../services/errorFunction.js";
import { Logger2 } from "../Logger/logger.js";
import { sendRecoveryPass } from "../config/email.js";

const logger = Logger2()

export const PassportSignUpController = passport.authenticate("singupStrategy", {
    failureRedirect: "/api/session/failure-signup"
})

export const SignupRedirectController = (req, res) => {
    req.session.user = req.user.name;
    req.session._id = req.user._id;
    req.session.email = req.user.email
    req.session.rol = req.user.rol
    req.session.cartid = req.user.cart[0]._id.toString()
    console.log(req.session)
    res.send(`Usuario registrado exitosamente! Ingresa a tu pérfil haciendo click <a href="/profile">Aquí</a>`)
}

export const FailureSignupController = (req, res) => {
    logger.error("Error al registrar el usuario")
    res.send("Error, no se ha resigstrado el usuario")
}

export const GithubAuthController = passport.authenticate("githubSignup")
export const GithubCallbackController = passport.authenticate("githubSignup", {
    failureRedirect: "/api/session/failure-signup"
})
export const GithubCallbackRedirectController = (req, res) => {
    req.session.user = req.user.name
    req.session.email = req.user.email
    req.session.rol = "user"
    console.log(req.session)
    res.send(`Usuario registrado exitosamente! Ingresa a tu pérfil haciendo click <a href="/profile">Aquí</a>`)
}

export const LoginController = async (req, res) => {

    try {
        const { email, password } = req.body;
        if (!email || !password) {
            logger.error("Falta usuario y/o contraseña")
            LoginErrorFunction(req.body)
        }
        const user = await usersModel.findOne({ email: email });
        if (!user) {
            res.send(`No existe ese usuario, por favor registrate en nuestro sitio haciendo click <a href="/signIn">Aquí</a>`);
        } else if (email === user.email && validatePassword(user, password) == true) {
            req.session.user = user.name;
            req.session._id = user._id;
            req.session.email = user.email;
            req.session.rol = user.rol;
            req.session.cartid = user.cart[0]._id.toString();
            user.last_connection = new Date() //actualizo last conection
            const userUpdated = await usersModel.findByIdAndUpdate(user._id, user)//se guarda en base de datos
            req.session.last_connection = user.last_connection
            console.log("usuario registrado")
            console.log("user data", user)
            res.redirect("/products")
        } else {
            logger.error("Usuario y contraseña incorrecto")
            PasswordErrorFunction();
            res.send("Usuario y/o contraseña incorrecto")
        }
    } catch (error) {
        res.status(403).send("Error de autentificación")
    }
}

export const CurrentController = (req, res) => {
    if (req.session) {
        return res.send({ userInfo: req.session });
    }
    res.send("Usuario No Logueado");
}

export const LogoutController = async (req, res) => {
    const user = { ...req.user }
    user.last_connection = new Date();
    const userUpdated = await usersModel.findByIdAndUpdate(user._id, user)
    req.session.destroy(error => {
        if (error) {
            res.send("No se pudo cerrar sesion");
        } else {
            res.redirect("/login")
        }
    });
}

export const ForgotController = async (req, res) => {
    try {
        const token = req.query.token
        const { email, newpassword } = req.body;
        const validEmail = verifyToken(token)
        if (!validEmail) {
            return res.send(`El enlace ya no es valido. Intentalo nuevamente haciendo click <a href="/resendpass">aquí</a>`)
        } else {
            if (!email) {
                logger.error("Falta email")
            }
            const user = await usersModel.findOne({ email: email });
            if (validatePassword(user, newpassword)) {
                return res.send("No puedes repetir la contraseña")
            }
            if (user) {
                user.password = hashPassword(newpassword);
                await usersModel.findOneAndUpdate({ email: user.email }, user);
                res.send("Su contraseña ha sido restablecida")
            } else {
                req.send("Usuario no registrado")
            }
        }
    } catch (error) {
        res.send("No se pudo restaurar la contraseña")
    }
}

export const resendPassController = async (req, res) => {
    try {
        const { email } = req.body
        const user = await usersModel.findOne({ email: email })
        if (user) {
            const token = emailToken(email, 240);
            await sendRecoveryPass(email, token)
            res.send(`Se ha enviado el email, puedes ingresar nuevamente haciendo click <a href="/login">aquí</a>`)
        } else {
            res.send(`Usuario inexistente, puedes registrarte haciendo click  <a herf="/signIn">aquí</a>`)
        }

    } catch (error) {
        res.send("No se pudo restablecer la contraseña")
    }
}