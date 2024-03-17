import FSDao from "./fs.dao.js";

export default class CartDaoFS extends FSDao {
    constructor(path) {
        super(path);
    }

    async addProductToCart(cartId, productId) {
        try {
            const carts = await this.getFile();
            const cartIndex = carts.findIndex((cart) => cart.id === cartId);

            if (cartIndex !== -1) {
                let productExists = false;
                for (let product of carts[cartIndex].products) {
                    if (product.product === productId) {
                        product.quantity = product.quantity + 1;
                        productExists = true;
                        break;
                    }
                }

                if (!productExists) {
                    const product = {
                        product: productId,
                        quantity: 1,
                    };
                    carts[cartIndex].products.push(product);
                }

                await this.updateFile(carts);
                return carts[cartIndex];
            } else {
                console.error("Cart with that ID not found");
            }
        } catch (error) {
            console.error("Error getting the cart by ID:", error);
        }
    }
}
