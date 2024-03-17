import Controllers from "../class.controller.js";
import TicketService from "../../services/carts/ticket.service.js";
import { createResponse } from "../../utils/response/create.response.js";
import { logger } from "../../utils/logger/logger.js";
const ticketService = new TicketService();

export default class TicketController extends Controllers {
    constructor() {
        super(TicketService);
    }

    async generateTicket(req, res, next) {
        try {
            const { _id } = req.user;
            logger.info(`_id, ${_id}`); //OK
            const userId = _id.toString();
            logger.info(`userId, ${userId} `); //OK
            const { cartId } = req.params;
            logger.info(`cartId, ${cartId}`); //OK
            const ticket = await ticketService.generateTicket(userId, cartId);
            if (!ticket) createResponse(res, 404, "Error generating ticket");
            else createResponse(res, 200, ticket);
        } catch (error) {
            logger.error(`Error en generateTicket = ${error}`);
            next(error.message);
        }
    }
}
