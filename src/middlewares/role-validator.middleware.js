import { createResponse } from "../utils/response/create.response.js";
import factory from "../persistence/factory.js";
import { logger } from "../utils/logger/logger.js";
const { userDao, prodDao } = factory;

export const roleAdmin = async (req, res, next) => {
    logger.info(`middleware ${JSON.stringify(req.session.passport.user)}`);
    const userId = req.session.passport.user;
    const user = await userDao.getById(userId);
    logger.debug(`user:${user}`);
    if (user && user.role === "admin") {
        next();
    } else {
        createResponse(res, 401, {
            error: "Solo autorizado para administradores",
        });
    }
};

export const roleUser = async (req, res, next) => {
    const userId = req.session.passport.user;
    const user = await userDao.getById(userId);
    if (user && user.role === "user") {
        next();
    } else {
        createResponse(res, 401, {
            error: "Solo autorizado para usuarios",
        });
    }
};

export const rolePremium = async (req, res, next) => {
    const userId = req.session.passport.user;
    const user = await userDao.getById(userId);
    if (user && user.role === "premium") {
        next();
    } else {
        createResponse(res, 401, {
            error: "Solo autorizado para usuarios premium",
        });
    }
};

export const roleAdminOrPremium = async (req, res, next) => {
    const userId = req.session.passport.user;
    const user = await userDao.getById(userId);

    if (!user) {
        return createResponse(res, 401, { error: "Usuario no autorizado" });
    }

    if (user.role === "admin") {
        return next();
    }

    if (user.role === "premium") {
        const productId = req.params.id;
        const product = await prodDao.getById(productId);

        if (!product) {
            return createResponse(res, 404, {
                error: "Producto no encontrado",
            });
        }

        if (product.owner !== user.email) {
            return createResponse(res, 401, {
                error: "No estás autorizado para eliminar o modificar este producto",
            });
        }

        return next();
    }
    createResponse(res, 401, {
        error: "Solo autorizado para administradores o usuarios premium",
    });
};

export const premiumCannotAddOwnProduct = async (req, res, next) => {
    const userId = req.session.passport.user;
    const user = await userDao.getById(userId);

    if (!user) {
        return createResponse(res, 401, { error: "Usuario no encontrado" });
    }

    if (user.role === "premium") {
        const productId = req.params.productId;
        const product = await prodDao.getById(productId);

        if (!product) {
            return createResponse(res, 404, {
                error: "Producto no encontrado",
            });
        }

        if (product.owner === user.email) {
            return createResponse(res, 403, {
                error: "No puedes agregar tu propio producto al carrito",
            });
        }
    }

    next();
};
