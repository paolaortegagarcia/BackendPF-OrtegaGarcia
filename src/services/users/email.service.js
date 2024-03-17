/* ------------------------------- Nodemailer ------------------------------- */

import { createTransport } from "nodemailer";
import "dotenv/config";
import config from "../../config/config.js";

/* -------------------------------- Ethereal -------------------------------- */

export const transporter = createTransport({
    service: "gmail",
    //   host: process.env.HOST,
    port: 465,
    secure: true,
    auth: {
        user: config.EMAIL,
        pass: config.PASSWORD,
    },
});

const createMsgRegister = (first_name) =>
    `<h1>Hola ${first_name}, ¡Bienvenido/a a Memini!</h1>`;

const createMsgResetPass = (first_name) => {
    return `<p>¡Hola ${first_name}!
            Haz click 
            <a href='http://localhost:8080/new-pass'>AQUÍ</a>
            para restablecer tu contraseña.
    </p>`;
};

export const sendMail = async (user, service, token = null) => {
    try {
        let msg = "";
        let subj = "";
        const { first_name, email } = user;

        if (service === "register") {
            msg = createMsgRegister(first_name);
            subj = "Bienvenid@";
        } else if (service === "resetPass") {
            msg = createMsgResetPass(first_name);
            subj = "Recuperación de contraseña";
        }

        const gmailOptions = {
            from: config.EMAIL,
            to: email,
            subject: subj,
            html: msg,
        };
        const response = await transporter.sendMail(gmailOptions);
        if (token) return token;
        console.log("email enviado", response);
    } catch (error) {
        throw new Error(error.message);
    }
};
