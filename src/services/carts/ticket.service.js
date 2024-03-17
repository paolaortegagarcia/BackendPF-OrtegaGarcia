import Services from "../class.service.js";
import persistence from "../../persistence/factory.js";
import { logger } from "../../utils/logger/logger.js";
import { v4 as uuidv4 } from "uuid";

const { ticketDao, userDao, prodDao, cartDao } = persistence;

export default class TicketServices extends Services {
    constructor() {
        super(ticketDao);
    }

    async generateTicket(userId, cartId) {
        try {
            logger.info(`entro al ticket service, ${userId}, ${cartId}`);
            const user = await userDao.getById(userId);
            logger.info("user desde ticket", user); //ok
            if (!user) return false;

            const cart = await cartDao.getById(cartId);
            logger.info(`cart desde ticket, ${cart}`); //ok
            if (!cart) return false;

            let amountAcc = 0;
            for (const p of cart.products) {
                const idProd = p.product._id.toString();
                logger.info("id prod desde el for", idProd); //OK
                const prodFromDB = await prodDao.getById(idProd);
                logger.info(`from db, ${prodFromDB}`); //ok
                logger.info(`p.quantity, ${p.quantity}`); //ok
                logger.info(`db.stock, ${prodFromDB.stock}`); //OK

                if (p.quantity <= prodFromDB.stock) {
                    const amount = p.quantity * prodFromDB.price;
                    amountAcc += amount;
                    logger.info(`precio total, ${amount}`);
                }
            }
            const ticket = await ticketDao.create({
                code: uuidv4(),
                purchase_datetime: new Date().toLocaleString(),
                amount: amountAcc,
                purchaser: user.email,
            });

            cart.products = [];
            cart.save();

            return ticket;
        } catch (error) {
            logger.error(`Error en generateTicket = ${error}`);
            throw new Error(error);
        }
    }
}
