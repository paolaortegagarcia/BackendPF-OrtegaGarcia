import { logger } from "../utils/logger.js";

export const isAuth = (req, res, next) => {
    logger.info(req.session.passport.user);
    logger.info(req.isAuthenticated());
    if (req.isAuthenticated()) return next();
    res.status(401).send({ msg: "Unauthorized" });
};
