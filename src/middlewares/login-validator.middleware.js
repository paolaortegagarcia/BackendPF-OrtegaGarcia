import { logger } from "../utils/logger.js";

export const validateLogIn = (req, res, next) => {
    logger.info(req.session);
    if (req.session.info && req.session.info.loggedIn) next();
    else res.status(401).json({ msg: "Usuario no Autorizado" });
};
