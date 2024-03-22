import { createHash } from "../../../../utils/bCrypt/register.bcrypt.js";
import { isValidPass } from "../../../../utils/bCrypt/login.bcrypt.js";
import { logger } from "../../../../utils/logger/logger.js";
import MongoDao from "../mongo.dao.js";
import { UserModel } from "./user.model.js";
import { generateToken } from "../../../../jwt/auth.js";

export default class UserDaoMongoDB extends MongoDao {
    constructor() {
        super(UserModel);
    }

    async findByEmail(email) {
        return await UserModel.findOne({ email });
    }

    async registerUser(user) {
        try {
            logger.info("Entered registerUser method");
            const { email, password } = user;

            if (email === "adminCoder@coder.com" && password === "admin123") {
                return await UserModel.create({
                    ...user,
                    password: createHash(password),
                    role: "admin",
                });
            } else if (
                email === "premiumCoder@coder.com" &&
                password === "premium123"
            ) {
                return await UserModel.create({
                    ...user,
                    password: createHash(password),
                    role: "premium",
                });
            }

            const userExists = await this.findByEmail(email);
            logger.info(`userexists ${userExists}`);

            if (!userExists || userExists === null) {
                try {
                    logger.info("entro al try");
                    const newUser = await UserModel.create({
                        ...user,
                        password: createHash(password),
                    });

                    logger.info("After UserModel.create");
                    return newUser;
                } catch (error) {
                    logger.error(
                        `desde user.dao.js - Error en userExists ${error}`
                    );
                    throw error;
                }
            } else {
                return false;
            }
        } catch (error) {
            logger.error(`desde user.dao.js - Error en registerUser ${error}`);
            throw error;
        }
    }

    async registerUserGithub(user) {
        try {
            const { email } = user;
            const userExists = await this.findByEmail(email);

            if (!userExists) {
                const newUser = await UserModel.create({
                    ...user,
                    isGithub: true,
                });
                return newUser;
            } else {
                return false;
            }
        } catch (error) {
            logger.error(
                "desde user.dao.js - Error en registerUserGithub",
                error
            );
            throw error;
        }
    }

    async loginUser(email, password) {
        try {
            logger.debug(`Entrando en el login dao ${email}, ${password}`);
            const userExists = await this.findByEmail(email);
            logger.info(userExists);

            if (!userExists) {
                return false;
            } else {
                const isValidPassword = isValidPass(password, userExists);
                logger.debug(
                    `Validación de contraseña en dao: ${isValidPassword}`
                );
                if (!isValidPassword) {
                    return false;
                } else {
                    await UserModel.findByIdAndUpdate(userExists._id, {
                        last_connection: new Date(),
                    });

                    return userExists;
                }
            }
        } catch (error) {
            logger.error(`Error en user.dao.js - loginUser ${error}`);
        }
    }

    async resetPass(user) {
        try {
            const { email } = user;
            const userExist = await this.findByEmail(email);
            if (userExist) return generateToken(userExist, "1h");
            else return false;
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async updatePass(user, password) {
        try {
            logger.debug(`desde dao ${password}`);
            const isEqual = isValidPass(password, user);
            logger.debug(`desde dao ${isEqual}`);
            if (isEqual) return false;
            const newPass = createHash(password);
            return await this.update(user._id, { password: newPass });
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async uploadDocuments(userId, documents) {
        try {
            return await this.model.findByIdAndUpdate(
                userId,
                {
                    $push: { documents: { $each: documents } },
                },
                { new: true }
            );
        } catch (error) {
            throw new Error(error);
        }
    }

    async findInactiveUsers(thresholdDate) {
        try {
            return await UserModel.find({
                last_connection: { $lt: thresholdDate },
                isGithub: { $ne: true },
            });
        } catch (error) {
            logger.error(`Error buscando usuarios inactivos: ${error}`);
            throw error;
        }
    }

    async deleteInactiveUsers(thresholdDate) {
        try {
            const result = await this.model.deleteMany({
                last_connection: { $lt: thresholdDate },
                isGithub: { $ne: true },
            });
            return result;
        } catch (error) {
            logger.error(`Error en deleteInactiveUsers DAO: ${error}`);
            throw error;
        }
    }
}
