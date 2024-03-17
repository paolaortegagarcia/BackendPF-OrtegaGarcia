import UserService from "../services/users/user.service.js";
const userService = new UserService();
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { logger } from "../utils/logger/logger.js";

const strategyOptions = {
    usernameField: "email",
    passwordField: "password",
    passReqToCallback: true,
};

const login = async (req, email, password, done) => {
    try {
        const userLogin = await userService.login(email, password);
        logger.debug(`Usuario devuelto: ${userLogin}`);

        if (!userLogin || undefined) {
            return done(null, false, {
                msg: "User not found or invalid credentials",
            });
        }
        return done(null, userLogin);
    } catch (error) {
        logger.error("desde local-strategy.js - Error during login:", error);
        return done(error);
    }
};

const loginStrategy = new LocalStrategy(strategyOptions, login);

passport.use("loginStrategy", loginStrategy);

passport.serializeUser((user, done) => {
    done(null, user.user._id);
});

passport.deserializeUser(async (id, done) => {
    const user = await userService.getById(id);
    return done(null, user);
});
