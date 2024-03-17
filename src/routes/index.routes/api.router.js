/* ---------------------------------- Rutas con /api --------------------------------- */
import { Router } from "express";

// Routers en detalle
import productRouter from "../detail.routes/products/product.router.js";
import cartRouter from "../detail.routes/carts/cart.router.js";
import userRouter from "../detail.routes/users/user.router.js";
import emailRouter from "../detail.routes/users/email.router.js";
import ticketRouter from "../detail.routes/carts/ticket.router.js";

export default class ApiRoutes {
    constructor() {
        this.router = Router();
        this.initRoutes();
    }

    initRoutes() {
        this.router.use("/carts", cartRouter);
        this.router.use("/products", productRouter);
        this.router.use("/users", userRouter);
        this.router.use("/email", emailRouter);
        this.router.use("/ticket", ticketRouter);
    }

    getRouter() {
        return this.router;
    }
}
