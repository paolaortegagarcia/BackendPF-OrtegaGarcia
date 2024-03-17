import MongoDao from "../mongo.dao.js";
import { logger } from "../../../../utils/logger/logger.js";
import { ProductModel } from "./product.model.js";
import { CartModel } from "../carts/cart.model.js";

export default class ProductDaoMongoDB extends MongoDao {
    constructor() {
        super(ProductModel); // para llamar al constructor de mongodao - le paso el modelo que quiero
    }

    async addProductToCart(cartId, productId) {
        try {
            const cart = await CartModel.findById(cartId);
            const existingProduct = await CartModel.findOne({
                _id: cartId,
                "products.product": productId,
            });

            if (existingProduct) {
                const response = await CartModel.findOneAndUpdate(
                    {
                        _id: cartId,
                        "products.product": productId,
                    },
                    {
                        $inc: {
                            "products.$.quantity": 1,
                        },
                    },
                    { new: true }
                );
                return response;
            } else {
                cart.products.push({ product: productId, quantity: 1 });
            }

            await cart.save();
            return cart;
        } catch (error) {
            logger.error(
                "desde product.dao.js - Error en addProductToCart",
                error
            );
        }
    }

    async getProductsQueries(page = 1, limit = 10, category, sort) {
        try {
            let queryCategory = {};

            if (category) {
                queryCategory = { category: category };
            }

            let sortOrder = sort === "asc" ? 1 : -1;

            let pagination = { page, limit };

            if (sort) {
                pagination.sort = { price: sortOrder };
            }

            const response = await ProductModel.paginate(
                queryCategory,
                pagination
            );
            return response;
        } catch (error) {
            logger.error(
                "desde product.dao.js - Error en getProductsQueries",
                error
            );
            return [];
        }
    }
}
