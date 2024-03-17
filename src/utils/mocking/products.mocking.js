import { es, fakerES } from "@faker-js/faker";
import { v4 as uuidv4 } from "uuid";

export const generateProduct = () => {
    return {
        name: fakerES.commerce.productName(),
        description: fakerES.commerce.productDescription(),
        price: fakerES.commerce.price(),
        stock: fakerES.number.int({ min: 0, max: 100 }),
        code: uuidv4(),
        category: fakerES.commerce.productAdjective(),
    };
};
