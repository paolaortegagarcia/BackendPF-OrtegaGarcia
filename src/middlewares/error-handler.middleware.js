import { logger } from "../utils/logger/logger.js";

export const errorHandler = (error, req, res, next) => {
    logger.error(`Error = ${error}`);
    const status = error.statusCode || 500;
    res.status(status).send(error.message);
};
