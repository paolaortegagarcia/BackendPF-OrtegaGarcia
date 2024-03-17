import { hashSync, genSaltSync } from "bcrypt";

export const createHash = (password) => {
    return hashSync(password, genSaltSync(10));
};
