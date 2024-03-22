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
        const now = Math.floor(Date.now() / 1000);
        const tokenExp = decode.exp;
        const timeUntilExp = tokenExp - now;

        if (timeUntilExp <= 300) {
            const newToken = userDao.generateToken(user, "15m");
            logger.info(">>>>>>SE REFRESCÓ EL TOKEN");
            res.set("Authorization", `Bearer ${newToken}`);
        }
        /* ------------------------------------ - ----------------------------------- */
        req.user = user;
        next();
    } catch (err) {
        logger.error(`Error en verifyToken, ${err}`);
        return res.status(401).json({ msg: "Unauthorized" });
    }
};
