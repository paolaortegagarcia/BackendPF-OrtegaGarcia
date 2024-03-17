import Controllers from "../class.controller.js";
import ProductService from "../../services/products/product.service.js";
import { logger } from "../../utils/logger/logger.js";
import { HttpResponse } from "../../utils/response/http.response.js";
import { errorsDictionary } from "../../utils/response/errors-dictionary.response.js";
const httpResponse = new HttpResponse();
const productService = new ProductService();

export default class ProductController extends Controllers {
    constructor() {
        super(productService);
    }

    /* ---------------------------------- Mock ---------------------------------- */

    async createMocksProducts(req, res, next) {
        try {
            const { cant } = req.query;
            const response = await productService.createMocksProducts(cant);
            return httpResponse.Ok(res, response);
        } catch (error) {
            logger.error(
                `desde product.controller.js - Error en createMocksProducts = ${error}`
            );
            next(error.menssage);
        }
    }

    /* ---------------------------------- Unión con el Cart --------------------------------- */

    async addProductToCart(req, res, next) {
        try {
            const { cartId, productId } = req.params;
            logger.info(`desde controller, ${cartId}, ${productId}`);
            const newProduct = await productService.addProductToCart(
                cartId,
                productId
            );
            logger.info(newProduct);
            if (!newProduct)
                httpResponse.NotFound(res, errorsDictionary.ERROR_ADD_TO_CART);
            else httpResponse.Ok(res, newProduct);
        } catch (error) {
            logger.error(
                `desde product.controller.js - Error en addProductToCart = ${error}`
            );
            next(error.message);
        }
    }

    /* ------------------------------------ Queries ----------------------------------- */

    async getProductsQueries(req, res, next) {
        try {
            const { page, limit, category, sort } = req.query;
            const response = await productService.getProductsQueries(
                page,
                limit,
                category,
                sort
            );

            if (!response)
                httpResponse.NotFound(res, errorsDictionary.ERROR_FETCH_ITEMS);

            const next = response.hasNextPage
                ? `http://localhost:8080/api/products/all?page=${response.nextPage}`
                : null;
            const prev = response.hasPrevPage
                ? `http://localhost:8080/api/products/all?page=${response.prevPage}`
                : null;

            httpResponse.Ok(res, {
                status: response.docs.length > 0 ? "success" : "error",
                payload: response.docs,
                info: {
                    count: response.totalDocs,
                    totalPages: response.totalPages,
                    hasNextPage: response.hasNextPage,
                    hasPrevPage: response.hasPrevPage,
                    page: response.page,
                    nextPage: next,
                    prevPage: prev,
                },
            });
        } catch (error) {
            logger.error(
                `desde product.controller.js - Error en getProductsQueries = ${error}`
            );
            next(error.message);
        }
    }

    /* ----------------------------------- DTO ---------------------------------- */

    async getProdById(req, res, next) {
        try {
            const { id } = req.params;
            const prod = await productService.getProdById(id);
            if (!prod)
                httpResponse.NotFound(res, errorsDictionary.ERROR_FETCH_ITEMS);
            else httpResponse.Ok(res, prod);
        } catch (error) {
            logger.error(
                `desde product.controller.js - Error en getProdById = ${error}`
            );
            next(error.message);
        }
    }

    async createProd(req, res, next) {
        try {
            const obj = req.body;
            const user = req.user;
            const newItem = await productService.createProd(obj, user);
            if (!newItem)
                httpResponse.NotFound(res, errorsDictionary.ERROR_CREATE_ITEM);
            else httpResponse.Ok(res, newItem);
        } catch (error) {
            logger.error(
                `desde product.controller.js - Error en createProd = ${error}`
            );
            next(error.message);
        }
    }
}
