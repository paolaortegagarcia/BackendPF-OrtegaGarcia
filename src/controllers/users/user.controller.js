import Controllers from "../class.controller.js";
import UserService from "../../services/users/user.service.js";
import { HttpResponse } from "../../utils/response/http.response.js";
import { errorsDictionary } from "../../utils/response/errors-dictionary.response.js";
import { logger } from "../../utils/logger/logger.js";
const httpResponse = new HttpResponse();
const userService = new UserService();

export default class UserController extends Controllers {
    constructor() {
        super(UserService);
    }

    async register(req, res, next) {
        try {
            logger.info("entro al controller register");
            const { email } = req.body;
            logger.info(email);
            const user = await userService.findByEmail(email);
            if (user) {
                return httpResponse.Forbidden(
                    res,
                    errorsDictionary.ERROR_CREATE_USER
                );
            }
            const newUser = await userService.register(req.body);
            httpResponse.Ok(res, newUser);
        } catch (error) {
            logger.error(
                `desde user.controller.js - Error en register = ${error}`
            );
            next(error.menssage);
        }
    }

    async login(req, res, next) {
        try {
            const { user, access_token } = await userService.login(
                req.body.email,
                req.body.password
            );
            if (!user) {
                httpResponse.Unauthorized(res, errorsDictionary.ERROR_LOGIN);
            } else {
                //res.header("Authorization", access_token)
                res.cookie("token", access_token, { httpOnly: true }).json({
                    msg: "Login OK",
                    access_token,
                });
            }
        } catch (error) {
            httpResponse.Unauthorized(res, errorsDictionary.ERROR_LOGIN);
            logger.error(
                `desde user.controller.js - Error en login = ${error}`
            );
            next(error.message);
        }
    }

    async logout(req, res) {
        try {
            logger.info(`Session before logout: ${req.session}`);
            req.session.destroy();
            logger.info(`Session after logout: ${req.session}`);
        } catch (error) {
            logger.error(
                `desde user.controller.js - Error en logout = ${error}`
            );
            next(error.message);
        }
    }

    async githubResponse(req, res, next) {
        try {
            logger.info(req.user);
            const { first_name, email, isGithub } = req.user;
            res.json({
                msg: "Register/Login Github ok",
                session: req.session,
                user: {
                    first_name,
                    email,
                    isGithub,
                },
            });
        } catch (error) {
            logger.error(
                `desde user.controller.js - Error en githubResponse = ${error}`
            );
            httpResponse.Unauthorized(res, errorsDictionary.ERROR_LOGIN);
        }
    }

    async renderAuthenticationError(req, res) {
        res.render("404-Login");
    }

    async profile(req, res, next) {
        const { first_name, last_name, email, role } = req.user;
        res.json({
            status: "success",
            userData: {
                first_name,
                last_name,
                email,
                role,
            },
        });
    }

    async current(req, res, next) {
        try {
            const user = req.user;
            const token = req.cookies.token;
            res.json({
                user,
                token,
            });
        } catch (error) {
            logger.error(
                `desde user.controller.js - Error en current = ${error}`
            );
            next(error.message);
        }
    }

    async resetPass(req, res, next) {
        try {
            const user = req.user;
            const tokenResetPass = await userService.resetPass(user);
            if (tokenResetPass) {
                res.cookie("tokenpass", tokenResetPass);
                return httpResponse.Ok(res, {
                    msg: "Email enviado para cambiar la contraseña",
                });
            } else {
                return httpResponse.NotFound(res, {
                    msg: "Ocurrió un error al enviar el email",
                });
            }
        } catch (error) {
            logger.error(
                `desde user.controller.js - Error en resetPass = ${error}`
            );
            next(error.message);
        }
    }

    async updatePass(req, res, next) {
        try {
            const user = req.user;
            logger.debug(`desde controller ${user}`);
            const { password } = req.body;
            logger.debug(`desde controller ${password}`);
            const updPass = await userService.updatePass(user, password);
            if (!updPass)
                return httpResponse.NotFound(
                    res,
                    errorsDictionary.ERROR_SAME_PASSWORD
                );
            res.clearCookie("tokenpass");
            return httpResponse.Ok(res, updPass);
        } catch (error) {
            next(error.message);
        }
    }

    changeRoles = async (req, res, next) => {
        try {
            const { uid } = req.params;
            const response = await userService.changeRoles(uid);
            httpResponse.Ok(res, response);
        } catch (error) {
            if (
                error.message ===
                "Faltan documentos requeridos para cambiar a premium."
            ) {
                httpResponse.Forbidden(res, error.message);
            } else {
                next(error);
            }
        }
    };

    uploadDocuments = async (req, res) => {
        try {
            const userId = req.params.uid;
            const files = req.files;

            const documents = files.map((file) => ({
                name: file.originalname,
                reference: `/path/to/${file.filename}`,
            }));

            const response = await userService.uploadDocuments(
                userId,
                documents
            );

            httpResponse.Ok(res, response);
        } catch (error) {
            logger.error(
                `desde user.controller.js - Error en uploadDocuments = ${error}`
            );
            next(error.message);
        }
    };

    deleteInactiveUsers = async (req, res) => {
        try {
            const { deletedCount, notifiedUsers } =
                await userService.deleteInactiveUsersAndNotify();
            res.status(200).json({
                message: `Usuarios inactivos notificados y eliminados. Total: ${notifiedUsers}, Eliminados: ${deletedCount}`,
            });
        } catch (error) {
            res.status(500).json({
                message: `Error eliminando usuarios inactivos: ${error.message}`,
            });
        }
    };

    /* ----------------------------------- DTO ---------------------------------- */

    getUserById = async (req, res, next) => {
        try {
            const { id } = req.user;
            const user = await userService.getUserById(id);
            logger.info(`respuesta desde controller, ${user}`);
            logger.info(user);
            if (!user)
                httpResponse.Unauthorized(res, errorsDictionary.ERROR_LOGIN);
            else httpResponse.Ok(res, user);
        } catch (error) {
            logger.error(
                `desde user.controller.js - Error en getUserById = ${error}`
            );
            next(error.message);
        }
    };
}
