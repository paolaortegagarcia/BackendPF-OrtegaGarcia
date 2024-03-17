import config from "../../config/config.js";
import MongoStore from "connect-mongo";

export const mongoStoreOptions = {
    store: MongoStore.create({
        mongoUrl: config.ATLAS_MONGO_URL,
        ttl: 120,
        crypto: {
            secret: config.SECRET_KEY_MONGOSTORE_SESSION,
        },
    }),
    secret: config.SECRET_KEY_MONGOSTORE_SESSION,
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 120000,
    },
};
