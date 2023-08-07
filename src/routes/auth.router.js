import { Router, json, urlencoded } from "express";
import { PassportSignUpController, SignupRedirectController, FailureSignupController, GithubAuthController, GithubCallbackController, GithubCallbackRedirectController, LoginController, CurrentController, LogoutController, ForgotController, resendPassController } from "../controllers/auth.controller.js";
import { uploaderProfile } from "../utils.js";

const authRouter = Router();
authRouter.use(json());
authRouter.use(urlencoded({ extended: true }));


//Ruta para SignIn con passport//
authRouter.post("/signIn", uploaderProfile.single("avatar"), PassportSignUpController, SignupRedirectController);

//Ruta para falla de SignIn con passport//
authRouter.get("/failure-signup", FailureSignupController);

//Ruta para SignIn con Github//
authRouter.get("/github", GithubAuthController);

//Ruta para falla de SignIn con Github//
authRouter.get("/github-callback", GithubCallbackController, GithubCallbackRedirectController);

//Ruta para Login//
authRouter.post("/login", LoginController);

//Ruta para Current//
authRouter.get("/current", CurrentController);

//Ruta de Logout//
authRouter.post("/logout", LogoutController);

//Ruta de forgot password//
authRouter.post("/forgot", ForgotController);

//Ruta email password//
authRouter.post("/resendpass", resendPassController)

export default authRouter;

