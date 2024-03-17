import { Strategy as GithubStrategy } from "passport-github2";
import passport from "passport";
import UserDaoMongoDB from "../persistence/dao/mongodb/users/user.dao.js";
import { logger } from "../utils/logger/logger.js";
import "dotenv/config";
const userDao = new UserDaoMongoDB();

const strategyOptions = {
    clientID: process.env.CLIENTID,
    clientSecret: process.env.CLIENTSECRET,
    callbackURL: "http://localhost:8080/api/users/github",
    scope: ["user:email"],
};

const registerOrLogin = async (accessToken, refreshToken, profile, done) => {
    try {
        logger.info("Perfil de GitHub:", profile);

        /* --------------------------------- Opcion1 -------------------------------- */
        const emailsArray = profile.emails;
        const email = emailsArray.length > 0 ? emailsArray[0].value : null;
        logger.info(email);

        /* --------------------------------- Opcion2 -------------------------------- */
        //const email = profile._json.email;

        if (!email) {
            return done(
                new Error(
                    "No se proporcionó un correo electrónico desde GitHub"
                ),
                null
            );
        }

        const user = await userDao.findByEmail(email);
        logger.info(user);
        if (user) {
            return done(null, user);
        }

        const newUser = await userDao.registerUserGithub({
            first_name: profile._json.name,
            email,
        });
        logger.info("Usuario creado: ", newUser);
        return done(null, newUser);
    } catch (error) {
        logger.error(error);
        //return done(error, null);
    }
};

passport.use("github", new GithubStrategy(strategyOptions, registerOrLogin));
