//librerias//
import { Server } from "socket.io";
import cookieParser from "cookie-parser";
import session from "express-session";
import MongoStore from "connect-mongo";
import path from "path";
import express from "express";
import { json, urlencoded } from "express";
import { engine } from "express-handlebars";
import passport from "passport";
import { initializedPassport } from "./config/passport.config.js";
import swaggerUi from "swagger-ui-express"

//Routers//
import productsRouter from "./routes/products.router.js";
import cartRouter from "./routes/cart.router.js";
import viewsRouter from "./routes/views.router.js"
import ChatManager from "./dao/db-managers/chat.manager.js";
import authRouter from "./routes/auth.router.js";
import usersRouter from "./routes/users.router.js";

//Propios//
import { __dirname } from "./utils.js";
import { options } from "./config/options.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import { addLogger } from "./Logger/logger.js";
import { swaggerSpecs } from "./config/docConfig.js";





const app = express();
app.use(json());
app.use(urlencoded({ extended: true }));
app.use(cookieParser());

app.use(express.static(__dirname + "/../public"))

let messages = [];
const chatManager = new ChatManager();

//-----Hnadlebars-----//
app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "/views"));



//-----Socket-----//
export const port = options.server.port;
const httpServer = app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

const io = new Server(httpServer);

io.on("connection", (socket) => {
  console.log("New Client Connected")

  socket.on("messages", async (data) => {
    const { username, message } = await chatManager.newMessage(data)
    messages.push(data);

    io.emit("messages", messages)
  });

  socket.on("new-user", (username) => {
    socket.emit(messages, messages);
    socket.broadcast.emit("new-user", username)
  })
});

app.use((req, res, next) => {
  req.io = io;
  next();
});

//-------------session-------//
app.use(
  session({
    store: MongoStore.create({
      mongoUrl: options.mongoDB.URL,
    }),
    secret: options.server.secretSession,
    saveUninitialized: true,
    resave: true,
  }));


//----Passport---//
initializedPassport();
app.use(passport.initialize());
app.use(passport.session());

//-----Router-----//

app.use("/", viewsRouter)
app.use("/api/products", productsRouter);
app.use("/api/carts", cartRouter);
// app.use("/products", viewsRouter);
// app.use("/login", viewsRouter);
// app.use("/profile", viewsRouter);
// app.use("/signIn", viewsRouter);
app.use("/api/session", authRouter);
app.use(errorHandler)
app.use(addLogger)
app.use("/api/users", usersRouter);
app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpecs))
//-----Moongose-----//
// Conexión a Moongose en tipo de persistencia//

export { app }