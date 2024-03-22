import express from "express";
import morgan from "morgan";
import handlebars from "express-handlebars";
import session from "express-session";
import { __dirname } from "./utils/utils.js";
import { mongoStoreOptions } from "./utils/session/mongostore.options.js";
import ApiRoutes from "./routes/index.routes/api.router.js";
import { errorHandler } from "./middlewares/error-handler.middleware.js";
import "./passport/local-strategy.js";
import passport from "passport";
import "./passport/github-strategy.js";
import "dotenv/config";
import config from "./config/config.js";
import cors from "cors";
import helmet from "helmet";
import { info } from "./docs/info.js";
import swaggerUI from "swagger-ui-express";
import swaggerJSDoc from "swagger-jsdoc";

const apiRoutes = new ApiRoutes();
const specs = swaggerJSDoc(info);

/* --------------------------------- Express / Passport -------------------------------- */

const app = express();
app.use("/docs", swaggerUI.serve, swaggerUI.setup(specs));
app.use(cors({ credentials: true, origin: process.env.APP }));
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));
app.use(morgan("dev"));

app.use(session(mongoStoreOptions));

app.use(passport.initialize());
app.use(passport.session());

/* --------------------------------- Routers -------------------------------- */

app.use("/api", apiRoutes.getRouter());

/* --------------------------------- Server --------------------------------- */

const PORT = config.PORT;
app.listen(PORT, () =>
    console.log(
        `🚀 Server is running on port ${PORT} - ${config.NODE_ENV} mode - ${config.PERSISTENCE} persistence`
    )
);

/* ---------------------------------- Error Handler--------------------------------- */

app.use(errorHandler);

export default app;
