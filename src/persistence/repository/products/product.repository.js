import factory from "../../factory.js";
const { prodDao } = factory;
import ProductResDTO from "../../dto/products/product-res.dto.js";
import ProductReqDTO from "../../dto/products/product-req.dto.js";
import { logger } from "../../../utils/logger/logger.js";

export default class ProductRepository {
    constructor() {
        this.dao = prodDao;
    }

    /* ------------------------------------ Acá se aplican los DTO ----------------------------------- */
    async getProdById(id) {
        try {
            const prod = await this.dao.getById(id);
            return new ProductResDTO(prod);
        } catch (error) {
            logger.error(
                "desde product.repository.js - Error en getProdById",
                error
            );
            throw new Error(error.message);
        }
    }

    async createProd(obj) {
        try {
            const prodDTO = new ProductReqDTO(obj);
            const response = await this.dao.create(prodDTO);
            return response;
        } catch (error) {
            logger.error(
                "desde product.repository.js - Error en createProd",
                error
            );
        }
    }
}
