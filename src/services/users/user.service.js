import Services from "../class.service.js";
import { logger } from "../../utils/logger/logger.js";
import { generateToken } from "../../jwt/auth.js";
import factory from "../../persistence/factory.js";
const { userDao } = factory;
import UserRepository from "../../persistence/repository/users/user.repository.js";
import { sendMail, sendInactiveUserEmail } from "./email.service.js";
const userRepository = new UserRepository();

export default class UserService extends Services {
    constructor() {
        super(userDao);
    }

    async findByEmail(email) {
        try {
            const response = await userDao.findByEmail(email);
            if (!response) {
                return false;
            } else {
                return response;
            }
        } catch (error) {
            logger.error(
                `desde user.service.js - Error en findByEmail = ${error}`
            );
            throw error;
        }
    }

    async register(user) {
        try {
            const response = await userDao.registerUser(user);
            if (!response) {
                return false;
            } else {
                await sendMail(user, "register");
                return response;
            }
        } catch (error) {
            logger.error(
                `desde user.service.js - Error en register = ${error}`
            );
            throw error;
        }
    }

    async login(email, password) {
        try {
            const userExist = await userDao.loginUser(email, password);
            if (!userExist) {
                return false;
            }
            const access_token = generateToken(userExist);
            logger.debug(`desde service ${userExist}`);
            return { user: userExist, access_token };
        } catch (error) {
            logger.error(`desde user.service.js - Error en login = ${error}`);
            throw error;
        }
    }

    async getById(id) {
        try {
            const response = await userDao.getById(id);
            return response;
        } catch (error) {
            logger.error(`desde user.service.js - Error en getById = ${error}`);
            throw error;
        }
    }

    async resetPass(user) {
        try {
            const token = await userDao.resetPass(user);
            if (token) {
                return await sendMail(user, "resetPass", token);
            } else {
                return false;
            }
        } catch (error) {
            logger.error(
                `desde user.service.js - Error en resetPass = ${error}`
            );
            throw error;
        }
    }

    async updatePass(user, password) {
        try {
            logger.debug(`desde service ${password}, ${user}`);
            const response = await userDao.updatePass(user, password);
            if (!response) return false;
            return response;
        } catch (error) {
            logger.error(
                `desde user.service.js - Error en updatePass = ${error}`
            );
            throw new Error(error.message);
        }
    }

    async changeRoles(userId) {
        try {
            const user = await userDao.getById(userId);

            if (user.role === "user") {
                const requiredDocuments = [
                    "Identificación",
                    "Comprobante de domicilio",
                    "Comprobante de estado de cuenta",
                ];
                const uploadedDocumentsNames = user.documents.map(
                    (doc) => doc.name
                );

                const hasAllDocuments = requiredDocuments.every((doc) =>
                    uploadedDocumentsNames.includes(doc)
                );

                if (!hasAllDocuments) {
                    throw new Error(
                        "Faltan documentos requeridos para cambiar a premium."
                    );
                }

                user.role = "premium";
            } else if (user.role === "premium") {
                user.role = "user";
            }

            return await userDao.update(userId, { role: user.role });
        } catch (error) {
            logger.error(`Error en changeRoles: ${error}`);
            throw error;
        }
    }

    async uploadDocuments(userId, documents) {
        try {
            return await userDao.uploadDocuments(userId, documents);
        } catch (error) {
            throw error;
        }
    }

    async deleteInactiveUsersAndNotify() {
        const thresholdDate = new Date(new Date().getTime() - 30 * 60 * 1000);
        try {
            const inactiveUsers = await userDao.findInactiveUsers(
                thresholdDate
            );

            if (inactiveUsers.length > 0) {
                await sendInactiveUserEmail(inactiveUsers);
                const deletionResult = await userDao.deleteInactiveUsers(
                    thresholdDate
                );
                return {
                    deletedCount: deletionResult.deletedCount,
                    notifiedUsers: inactiveUsers.length,
                };
            }
            return { deletedCount: 0, notifiedUsers: 0 };
        } catch (error) {
            throw new Error(
                `UserService deleteInactiveUsersAndNotify: ${error}`
            );
        }
    }
    /* ----------------------------------- DTO ---------------------------------- */

    async getUserById(id) {
        try {
            const user = await userRepository.getUserById(id);
            logger.info(`respuesta desde service, ${user}`);
            if (!user) return false;
            else return user;
        } catch (error) {
            logger.error(
                `desde user.service.js - Error en getUserById = ${error}`
            );
            throw new Error(error.message);
        }
    }
}
