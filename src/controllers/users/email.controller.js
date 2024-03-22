import "dotenv/config";
import { template } from "../../services/users/email-templates/template.js";
import { transporter } from "../../services/users/email.service.js";
import { logger } from "../../utils/logger/logger.js";

export const sendGmail = async (req, res) => {
    try {
        const { dest, name } = req.body;
        const gmailOptions = {
            from: process.env.EMAIL,
            to: dest,
            subject: "Bienvenida/o",
            html: template,
            attachments: [
                {
                    path:
                        process.cwd() +
                        "/src/services/email-templates/text.txt",
                    filename: `Adjunto-${name}`,
                },
            ],
        };
        const response = await transporter.sendMail(gmailOptions);
        res.json(response);
    } catch (error) {
        logger.error(`Error en sendGmail = ${error}`);
        next(error.menssage);
    }
};
