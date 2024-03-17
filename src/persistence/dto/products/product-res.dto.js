// así es como voy a mandar la respuesta sin tocar la base de datos

export default class ProductResDTO {
    constructor(product) {
        this.nameProd = product.name;
        this.descriptionProd = product.description;
        this.priceProd = product.price;
        this.stockProd = product.stock;
    }
}
