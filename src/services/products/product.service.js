import Services from "../class.service.js";
import factory from "../../persistence/factory.js";
import ProductRepository from "../../persistence/repository/products/product.repository.js";
import { generateProduct } from "../../utils/mocking/products.mocking.js";
import { logger } from "../../utils/logger/logger.js";
const prodRepository = new ProductRepository();
const { prodDao } = factory;

export default class ProductService extends Services {
    constructor() {
        super(prodDao);
    }

    /* ---------------------------------- Mock ---------------------------------- */

    async createMocksProducts(cant = 100) {
        try {
            const productsArray = [];
            for (let i = 0; i < cant; i++) {
                const product = generateProduct();
                productsArray.push(product);
            }
            const products = await prodDao.create(productsArray);
            return products;
        } catch (error) {
            logger.error(
                `desde product.service.js - Error en createMocksProducts = ${error}`
            );
        }
    }

    /* ---------------------------------- Unión con el Cart --------------------------------- */

    async addProductToCart(cartId, productId) {
        try {
            logger.info(
                `entro al service add to cart, ${cartId}. ${productId}`
            );
            const exists = await prodDao.getById(productId);
            const newProduct = await prodDao.addProductToCart(
                cartId,
                productId
            );
            if (!exists) throw new Error("Product not found");
            return newProduct;
        } catch (error) {
            logger.error(
                `desde product.service.js - Error en addProductToCart = ${error}`
            );
        }
    }

    /* ------------------------------------ Queries ----------------------------------- */

    async getProductsQueries(page, limit, category, sort) {
        try {
            return await prodDao.getProductsQueries(
                page,
                limit,
                category,
                sort
            );
        } catch (error) {
            logger.error(`Error en getProductsQueries = ${error}`);
        }
    }

    /* ----------------------------------- DTO ---------------------------------- */

    async getProdById(id) {
        try {
            const prod = await prodRepository.getProdById(id);
            if (!prod) return false;
            else return prod;
        } catch (error) {
            logger.error(`Error en getProdById = ${error}`);
            throw new Error(error.message);
        }
    }

    async createProd(obj, user) {
        try {
            const newProd = { ...obj };
            const owner = user.role === "premium" ? user.email : "admin";
            newProd.owner = owner;
            const newItem = await prodRepository.createProd(newProd);
            if (!newItem) return false;
            else return newItem;
        } catch (error) {
            logger.error(`Error en createProd = ${error}`);
        }
    }
}
