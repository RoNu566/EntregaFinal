import passport from "passport";
import localStrategy from "passport-local";
import usersModel from "../dao/models/users.model.js";
import { hashPassword, validatePassword } from "../utils.js";
import GithubStrategy from "passport-github2";
import { CartManager } from "./persistance.js";
import { CreateUserErrorFunction } from "../services/errorFunction.js";

const cartToWork = new CartManager;

const initializedPassport = () => {
    passport.use("singupStrategy", new localStrategy(
        {
            usernameField: "email",
            passReqToCallback: true
        },
        async (req, username, password, done) => {
            try {
                const { name, last_name, age } = req.body;
                if (!name || !last_name || !age) {
                    CreateUserErrorFunction(req.body)
                }
                const user = await usersModel.findOne({ email: username });
                if (user) {
                    return done(null, false)
                }
                let rol = "user"
                if (username.endsWith("@coder.com")) {
                    rol = "admin"
                }

                const nuevoUsuario = {
                    name,
                    last_name,
                    age,
                    email: username,
                    password: hashPassword(password),
                    rol,
                    cart: await cartToWork.addCart(),
                    avatar: req.file.path
                };
                const userCreated = await usersModel.create(nuevoUsuario);
                return done(null, userCreated);
            } catch (error) {
                return done(error);
            }

        }
    ));


    passport.use("githubSignup", new GithubStrategy(
        {
            clientID: "Iv1.e9aef454727d1791",
            clientSecret: "036d3becda144bda16d50aba01374559ce0f9b20",
            callbackURL: "http://localhost:8080/api/session/github-callback"
        },

        async (accesToken, refreshToken, profile, done) => {
            try {
                console.log("profile", profile);
                const userExist = await usersModel.findOne({ email: profile.username });
                if (userExist) {
                    return done(null, userExist);
                } else {
                    const newUser = {
                        name: profile.displayName,
                        email: profile.username,
                        password: hashPassword(profile.id), //genero la pass desde el id de GitHub
                        rol: "user"
                    };
                    const aux = await usersModel.create(newUser);
                    return done(null, aux);
                }
            } catch (err) {
                return done(err)
            }
        }
    ))

    //**serializar y deserealizar **//

    passport.serializeUser((user, done) => {
        done(null, user._id)
    });

    passport.deserializeUser(async (id, done) => {
        const user = await usersModel.findById(id);
        return done(null, user)
    });
}
export { initializedPassport }