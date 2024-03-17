import { Schema, model } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

export const productCollection = "products";

export const productSchema = new Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    code: { type: String, required: true },
    price: { type: Number, required: true },
    stock: { type: Number, required: true },
    category: { type: String, required: true, index: true },
    owner: {
        type: String,
        ref: "users",
        required: true,
        default: "admin",
    },
});

productSchema.plugin(mongoosePaginate);

export const ProductModel = model(productCollection, productSchema);
