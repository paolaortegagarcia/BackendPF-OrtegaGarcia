import config from "../config/config.js";
import { logger } from "../utils/logger/logger.js";
/* ---------------------------------- Mongo --------------------------------- */
import { initMongoDB } from "../config/connection.js";
import UserDaoMongoDB from "./dao/mongodb/users/user.dao.js";
import ProductDaoMongoDB from "./dao/mongodb/products/product.dao.js";
import CartDaoMongoDB from "./dao/mongodb/carts/cart.dao.js";
import TicketDaoMongoDB from "./dao/mongodb/tickets/ticket.dao.js";

/* ----------------------------------- FS ----------------------------------- */
import CartDaoFS from "./dao/filesystem/cart.dao.js";
import ProductDaoFS from "./dao/filesystem/product.dao.js";

let userDao;
let prodDao;
let cartDao;
let ticketDao;

let persistence = config.PERSISTENCE; //desde config
//let persistence = process.argv[2]; //linea de comando
//let persistence = process.argv[3]; //linea de comando con test

switch (persistence) {
    case "FS":
        prodDao = new ProductDaoFS(
            "./src/persistence/dao/filesystem/db/products.json"
        );
        cartDao = new CartDaoFS(
            "./src/persistence/dao/filesystem/db/carts.json"
        );
        logger.info(`desde factory.js = ${persistence}`);
        break;
    case "MONGO":
        initMongoDB.getInstance(); // patron singleton
        prodDao = new ProductDaoMongoDB();
        cartDao = new CartDaoMongoDB();
        userDao = new UserDaoMongoDB();
        ticketDao = new TicketDaoMongoDB();
        logger.info(`desde factory.js = ${persistence}`);
        break;
    default:
        prodDao = new ProductDaoFS(
            "./src/persistence/dao/filesystem/db/products.json"
        );
        cartDao = new CartDaoFS(
            "./src/persistence/dao/filesystem/db/carts.json"
        );
        logger.info(`desde factory.js = ${persistence}`);
        break;
}

export default { userDao, prodDao, cartDao, ticketDao };
