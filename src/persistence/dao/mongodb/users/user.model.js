import { Schema, model } from "mongoose";

export const userCollection = "users";

const roles = ["admin", "user", "premium"];

export const userSchema = new Schema({
    first_name: {
        type: String,
        required: true,
    },
    last_name: {
        type: String,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    age: {
        type: Number,
    },
    password: {
        type: String,
    },
    cart: { type: Schema.Types.ObjectId, ref: "carts" },
    role: {
        type: String,
        enum: roles,
        default: "user",
    },
    isGithub: {
        type: Boolean,
        default: false,
    },
    documents: [
        {
            name: String,
            reference: String,
        },
    ],
    last_connection: Date,
});

userSchema.pre("find", function () {
    this.populate("cart");
});

export const UserModel = model(userCollection, userSchema);
