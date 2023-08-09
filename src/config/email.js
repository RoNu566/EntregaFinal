import nodemailer from "nodemailer";
import { options } from "./options.js";

export const transporter = nodemailer.createTransport({
    service: "gmail",
    port: 587,
    auth: {
        user: options.email.admin,
        pass: options.email.pass,
    },
    secure: false,
    tls: {
        rejectUnauthorized: false
    }
});

const sendRecoveryPass = async (userEmail, token) => {
    const link = `api/forgot?token=${token}`;
    // const link = `http://localhost:8080/forgot?token=${token}`;

    await transporter.sendMail({
        from: options.email.admin,
        to: userEmail,
        subject: "Olvido de Contraseña",
        html: `
        <div>
        <h2>Has solicitado un link para restablecer la contraseña</h2>
        <p>Da click en el siguiente boton para poder modificar tu contraseña</p>
        <a href="${link}">
            <button>Restablecer Contraseña</button>
        </a>
        </div>
        `
    })

}

export { sendRecoveryPass }