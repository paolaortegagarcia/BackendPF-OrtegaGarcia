import { Router } from "express";
import { verifyToken } from "../../../middlewares/verify-token.middleware.js";
import UserController from "../../../controllers/users/user.controller.js";
const controller = new UserController();
import passport from "passport";
import { validateRegister } from "../../../middlewares/user-validator.middleware.js";
import { uploader } from "../../../middlewares/multer.js";

const router = Router();

// si tengo que hacer la validación para varias rutas (siempre mirar que necesiten las mismas validaciones), puedo usar el .use() en el index o en un hilo - ver clase 30

router.post("/register", validateRegister, controller.register);
router.post("/login", passport.authenticate("loginStrategy"), controller.login);
router.get("/private", verifyToken, controller.getUserById); //usando DTO y JWT

router.post("/logout", controller.logout);
router.get("/authenticationError", controller.renderAuthenticationError);

router.post("/reset-pass", verifyToken, controller.resetPass);
router.put("/new-pass", verifyToken, controller.updatePass);

router.post(
    "/:uid/documents",
    uploader.array("documents"),
    controller.uploadDocuments
);
router.post("/premium/:uid", controller.changeRoles);

router.get(
    "/register-github",
    passport.authenticate("github", { scope: ["user:email"] })
);
router.get(
    "/github",
    passport.authenticate("github", { scope: ["user:email"] }),
    controller.githubResponse
);

export default router;
