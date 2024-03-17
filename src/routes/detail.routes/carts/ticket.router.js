import { Router } from "express";
import TicketController from "../../../controllers/carts/ticket.controller.js";
import { verifyToken } from "../../../middlewares/verify-token.middleware.js";

const controller = new TicketController();
const router = Router();

router.post("/cart/:cartId", verifyToken, controller.generateTicket);

export default router;
