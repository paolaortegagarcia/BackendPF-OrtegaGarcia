import FSDao from "./fs.dao.js";

export default class ProductDaoFS extends FSDao {
    constructor(path) {
        super(path);
    }

    async getProductsByLimit(limit) {
        try {
            const products = await this.getFile();
            if (!limit || limit >= products.length) return products;
            else return products.slice(0, limit);
        } catch (error) {
            console.log("Error getting the products by limit", error);
        }
    }
}
