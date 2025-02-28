import express from "express";
import OrderController from "../controller/order.controller";
import { strictLimiter } from "../middleware/rateLimiter.middleware";
import OrderMiddleware from "../middleware/order.middleware";

const orderMiddleware = new OrderMiddleware();
const orderController = new OrderController();

const orderRouter = express.Router();

orderRouter.get(
	"/",
	orderMiddleware.validateFilteringQueries,
	orderController.getAllOrders,
);

orderRouter.post(
	"/create",
	strictLimiter,
	// authMiddleware.authenticate(["admin"]),
	orderMiddleware.validateOrderCreation,
	orderController.createOrder,
);

orderRouter.get(
	"/order-status",
	orderMiddleware.validateFilteringQueries,
	orderController.getAllOrderStatuses,
);

orderRouter.post(
	"/create-order-status",
	strictLimiter,
	orderMiddleware.validateOrderStatusCreation,
	orderController.createOrderStatus,
);

orderRouter.put(
	"/create-order-status",
	strictLimiter,
	orderMiddleware.validateOrderStatusEdit,
	orderController.editOrderStatus,
);

export default orderRouter;
