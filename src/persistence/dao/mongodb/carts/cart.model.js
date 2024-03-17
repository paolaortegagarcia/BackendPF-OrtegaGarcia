import { Schema, model } from "mongoose";

export const cartCollection = "carts";

export const cartSchema = new Schema({
    products: [
        {
            product: {
                type: Schema.Types.ObjectId,
                ref: "products",
                default: null,
            },
            quantity: {
                type: Number,
                required: true,
                default: 1,
            },
            _id: false,
        },
    ],
});

cartSchema.pre("find", function () {
    this.populate({
        path: "products.product",
        model: "products",
    });
});

export const CartModel = model(cartCollection, cartSchema);
