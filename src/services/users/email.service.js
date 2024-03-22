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

const createMsgInactiveUser = (first_name) => {
    return `<p>Hola ${first_name},</p>
            <p>Tu cuenta ha sido eliminada debido a la inactividad prolongada. Si deseas continuar usando nuestros servicios, por favor crea una nueva cuenta.</p>`;
};

export const sendInactiveUserEmail = async (inactiveUsers) => {
    for (const user of inactiveUsers) {
        try {
            const msg = createMsgInactiveUser(user.first_name);
            const subj = "Cuenta eliminada por inactividad";

            const gmailOptions = {
                from: config.EMAIL,
                to: user.email,
                subject: subj,
                html: msg,
            };

            const response = await transporter.sendMail(gmailOptions);
            console.log(
                `Correo de eliminación enviado a ${user.email}:`,
                response
            );
        } catch (error) {
            console.error(
                `Error al enviar correo de eliminación a ${user.email}:`,
                error
            );
        }
    }
};
