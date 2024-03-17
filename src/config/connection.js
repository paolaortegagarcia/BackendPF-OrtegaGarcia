import mongoose, { connect } from "mongoose";
import config from "./config.js";
import { logger } from "../utils/logger/logger.js";

let MONGO_URL = "";

if (config.PERSISTENCE === "MONGO") {
    switch (config.NODE_ENV) {
        case "dev":
            MONGO_URL = config.ATLAS_MONGO_URL;
            logger.info("desde connection.js = Mongo Atlas");
            break;
        case "test":
            MONGO_URL = config.ATLAS_MONGO_TEST_URL;
            logger.info("desde connection.js = Mongo Atlas Testing");
            break;
        default:
            MONGO_URL = config.ATLAS_MONGO_URL;
            logger.info("desde connection.js = Mongo Atlas");
            break;
    }
}

export class initMongoDB {
    static #instance;

    constructor() {
        connect(MONGO_URL);
    }

    static getInstance() {
        if (this.#instance) {
            logger.info("Ya está conectado a MongoDB");
            return this.#instance;
        } else {
            this.#instance = new initMongoDB();
            logger.info("Conectado a MongoDB!");
            return this.#instance;
        }
    }

    static async dropProductsCollection() {
        if (config.NODE_ENV === "test") {
            await connect(config.ATLAS_MONGO_TEST_URL);
            await mongoose.connection.collections["products"].drop();
            logger.info(
                "Colección 'products' eliminada en la base de datos de pruebas."
            );
        } else {
            logger.info(
                "No es un entorno de prueba. No se eliminó ninguna colección."
            );
        }
    }

    static async dropCartsCollection() {
        if (config.NODE_ENV === "test") {
            await connect(config.ATLAS_MONGO_TEST_URL);
            await mongoose.connection.collections["carts"].drop();
            logger.info(
                "Colección 'carts' eliminada en la base de datos de pruebas."
            );
        } else {
            logger.info(
                "No es un entorno de prueba. No se eliminó ninguna colección."
            );
        }
    }
}
