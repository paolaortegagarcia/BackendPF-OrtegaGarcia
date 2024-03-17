import "dotenv/config";

export default {
    NODE_ENV: process.env.NODE_ENV || "test",
    PORT: process.env.PORT || 8080,
    PERSISTENCE: process.env.PERSISTENCE || "MONGO",
    ATLAS_MONGO_URL: process.env.ATLAS_MONGO_URL,
    ATLAS_MONGO_TEST_URL: process.env.ATLAS_MONGO_TEST_URL,
    SECRET_KEY_JWT: process.env.SECRET_KEY_JWT,
    SECRET_KEY_MONGOSTORE_SESSION: process.env.SECRET_KEY_MONGOSTORE_SESSION,
    NODE_ENV: process.env.NODE_ENV || "prod",
    APP: process.env.APP || "http://localhost:8080",
    CLIENTID: process.env.CLIENTID,
    CLIENTSECRET: process.env.CLIENTSECRET,
    HOST: process.env.HOST,
    NAME: process.env.NAME,
    EMAIL: process.env.EMAIL,
    PASSWORD: process.env.PASSWORD,
};
