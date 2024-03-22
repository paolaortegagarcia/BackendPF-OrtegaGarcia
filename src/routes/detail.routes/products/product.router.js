import { Router } from "express";
import { productValidator } from "../../../middlewares/product-validator.middleware.js";
import ProductController from "../../../controllers/products/product.controller.js";
import {
    premiumCannotAddOwnProduct,
    roleAdmin,
    roleAdminOrPremium,
    rolePremium,
    roleUser,
} from "../../../middlewares/role-validator.middleware.js";
const controller = new ProductController();

const router = Router();

/* ---------------------------------- Mock ---------------------------------- */

router.post("/mockingproducts", controller.createMocksProducts);

/* ---------------------------------- Get All ---------------------------------- */

//router.get("/all", controller.getProductsQueries); //  queries y aggregations

router.get("/all", controller.getAll); // sin queries

/* ---------------------------------- CRUD ---------------------------------- */

router.post(
    "/add/:cartId/:productId",
    premiumCannotAddOwnProduct,
    controller.addProductToCart
);

router.get("/:id", controller.getById);

router.post("/", rolePremium, productValidator, controller.create);

router.put("/:id", controller.update);

router.delete("/:id", controller.delete);

router.get("/dto/:id", controller.getProdById);

export default router;
