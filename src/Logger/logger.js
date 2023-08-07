import winston from "winston";
import { __dirname } from "../utils.js";
import path from "path";
import dotenv from "dotenv"

dotenv.config();


const CurrentEnv = process.env.NODE_ENV || "development";

const customLevelOptions = {
    levels: {
        fatal: 0,
        error: 1,
        warning: 2,
        info: 3,
        http: 4,
        debug: 5
    },
    colors: {
        fatal: "red",
        error: "magenta",
        warning: "yellow",
        info: "blue",
        http: "green",
        debug: "white"
    }
}

const devLogger = winston.createLogger({
    levels: customLevelOptions.levels,
    transports: [
        new winston.transports.Console({
            level: "debug", //defino el nivel del transportador
            format: winston.format.combine(
                winston.format.colorize({ colors: customLevelOptions.colors }),
                winston.format.simple()
            )
        })
    ]
})

const prodLogger = winston.createLogger({
    levels: customLevelOptions.levels,
    transports: [
        new winston.transports.Console({
            level: "info", //defino el nivel del transportador
            format: winston.format.combine(
                winston.format.colorize({ colors: customLevelOptions.colors }),
                winston.format.simple()
            )
        }),
        new winston.transports.File({
            filename: path.join(__dirname, "/Logger/logs/errors.log"),
            level: "error",
            format: winston.format.combine(
                winston.format.colorize({ colors: customLevelOptions.colors })
            )
        })
    ]
})

//middleware//
export const addLogger = (req, res, next) => {
    if (CurrentEnv === "development") {
        req.logger = devLogger
    } else {
        req.logger = prodLogger;
    }
    // req.logger.fatal(`level fatal`)
    // req.logger.error(`level error`)
    // req.logger.warning(`level warning`)
    // req.logger.info(`level info`)
    // req.logger.http(`level http`)
    // req.logger.debug(`level debug`)
    next();

}

export const Logger2 = () => {
    let CurrentLogger;
    if (CurrentEnv === "development") {
        CurrentLogger = devLogger
    } else {
        CurrentLogger = prodLogger;
    }
    return CurrentLogger;
}