import jwt from "jsonwebtoken";
import "dotenv/config";

export const SECRET_KEY_JWT = process.env.SECRET_KEY_JWT;

export const generateToken = (user, expires = "10m") => {
    const payload = {
        userId: user._id,
    };
    const token = jwt.sign(payload, SECRET_KEY_JWT, { expiresIn: expires });
    return token;
};
