import Controllers from "../class.controller.js";
import CartService from "../../services/carts/cart.service.js";
import { HttpResponse } from "../../utils/response/http.response.js";
import { errorsDictionary } from "../../utils/response/errors-dictionary.response.js";
import { logger } from "../../utils/logger/logger.js";
const httpResponse = new HttpResponse();
const cartService = new CartService();

export default class CartController extends Controllers {
    constructor() {
        super(cartService);
    }

    async deleteProductFromCart(req, res, next) {
        try {
            const { cartId, productId } = req.params;
            await cartService.deleteProductFromCart(cartId, productId);
            httpResponse.Ok(res, {
                msg: `Product ID ${productId} deleted successfully`,
            });
        } catch (error) {
            logger.error(
                `desde cart.controller.js - Error en deleteProductFromCart = ${error}`
            );
            next(error.message);
        }
    }

    async updateCart(req, res, next) {
        try {
            const { cartId } = req.params;
            logger.info("en el controller", cartId);
            const updatedProducts = req.body.products;
            const updatedCart = await cartService.updateCart(
                cartId,
                updatedProducts
            );
            httpResponse.Ok(res, updatedCart);
        } catch (error) {
            logger.error(
                `desde cart.controller.js - Error en updateCart = ${error}`
            );
            next(error.message);
        }
    }

    async updateProductQuantity(req, res, next) {
        try {
            const { cartId, productId } = req.params;
            const { quantity } = req.body;
            const updatedCart = await cartService.updateProductQuantity(
                cartId,
                productId,
                quantity
            );
            httpResponse.Ok(res, updatedCart);
        } catch (error) {
            logger.error(
                `desde cart.controller.js - Error en updateProductQuantity = ${error}`
            );
            next(error.message);
        }
    }

    async deleteAllProductsFromCart(req, res, next) {
        try {
            const { cartId } = req.params;
            const updatedCart = await cartService.deleteAllProductsFromCart(
                cartId
            );

            if (updatedCart === null) {
                httpResponse.NotFound(res, errorsDictionary.ERROR_FETCH_ITEMS);
            } else {
                httpResponse.Ok(res, {
                    msg: `Products from Cart ID ${cartId} deleted successfully`,
                });
            }
        } catch (error) {
            logger.error(
                `desde cart.controller.js - Error en deleteAllProductsFromCart = ${error}`
            );
            next(error.message);
        }
    }
}
