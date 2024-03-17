import { compareSync } from "bcrypt";

export const isValidPass = (password, user) => {
    console.log("Recibiendo en utils: ", password, user.password);
    return compareSync(password, user.password); // password sin hashear comparada con la hasheada
};
