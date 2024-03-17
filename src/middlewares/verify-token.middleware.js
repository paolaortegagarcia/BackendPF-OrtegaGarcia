import jwt from "jsonwebtoken";
import UserDaoMongoDB from "../persistence/dao/mongodb/users/user.dao.js";
import { logger } from "../utils/logger/logger.js";
const userDao = new UserDaoMongoDB();
import "dotenv/config";

const SECRET_KEY = process.env.SECRET_KEY_JWT;

export const verifyToken = async (req, res, next) => {
    const authHeader =
        req.cookies.token || req.get("Authorization").split(" ")[1];
    if (!authHeader) return res.status(401).json({ msg: "Unauthorized" });
    try {
        const token = authHeader;
        const decode = jwt.verify(token, SECRET_KEY);
        logger.info(`Token Decodificado, ${decode}`);
        const user = await userDao.getById(decode.userId);
        logger.debug(user);
        if (!user) return res.status(400).json({ msg: "Unauthorized" });

        /* -------------------------------- Refrescar Token ------------------------------- */
        const now = Math.floor(Date.now() / 1000); // Tiempo actual en segundos
        const tokenExp = decode.exp; // Tiempo de expiración del token
        const timeUntilExp = tokenExp - now; // Tiempo hasta la expiración en segundos

        if (timeUntilExp <= 300) {
            // 300 segundos = 5 minutos
            // Generar un nuevo token con un tiempo de expiración renovado
            const newToken = userDao.generateToken(user, "15m");
            logger.info(">>>>>>SE REFRESCÓ EL TOKEN");
            res.set("Authorization", `Bearer ${newToken}`); // Agregar el nuevo token al encabezado
        }
        /* ------------------------------------ - ----------------------------------- */
        req.user = user;
        next();
    } catch (err) {
        logger.error(`Error en verifyToken, ${err}`);
        return res.status(401).json({ msg: "Unauthorized" });
    }
};
