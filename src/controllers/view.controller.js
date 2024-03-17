import Controllers from "./class.controller.js";
import ProductService from "../services/products/product.service.js";
import { logger } from "../utils/logger/logger.js";
const productService = new ProductService();

export default class ViewController extends Controllers {
    constructor() {
        super(productService);
    }

    async renderHome(req, res, next) {
        res.render("welcome");
    }

    async renderProducts(req, res, next) {
        try {
            logger.info("en el home");
            const products = await service.getAll();
            /* ------------------------------- FileSystem ------------------------------- */
            // res.render("home", { products });

            /* ---------------------------------- Mongo --------------------------------- */
            const productsMongo = products.map((product) =>
                Object.assign({}, product.toJSON())
            );

            const { email, role } = req.session;
            logger.info("rol en controller", role);

            res.render("home", {
                products: productsMongo,
                user: { email, role },
            });
        } catch (error) {
            logger.error("Error en renderProducts", error);
            next(error.message);
        }
    }

    async renderRealTimeProducts(req, res, next) {
        try {
            const products = await service.getAll();
            res.render("realTimeProducts", { products });
        } catch (error) {
            logger.error("Error en renderRealTimeProducts", error);
            next(error.message);
        }
    }

    async renderLogInForm(req, res, next) {
        try {
            res.render("login");
        } catch (error) {
            logger.error(`Error en renderLogInForm = ${error}`);
            next(error.message);
        }
    }

    async renderRegisterForm(req, res, next) {
        try {
            res.render("register");
        } catch (error) {
            logger.error(`Error en renderRegisterForm = ${error}`);
            next(error.message);
        }
    }

    async renderUserProfile(req, res, next) {
        try {
            res.render("profile");
        } catch (error) {
            logger.error(`Error en renderUserProfile = ${error}`);
            next(error.message);
        }
    }
}
