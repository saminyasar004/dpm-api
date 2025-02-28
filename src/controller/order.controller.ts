import { Request, Response, NextFunction } from "express";
import { responseSender } from "../util";
import { Op, Order, WhereOptions } from "sequelize";
import OrderService from "../service/order.service";
import { OrderAttributes } from "../model/order.model";
import { OrderStatusAttributes } from "../model/order-status.model";

class OrderController {
	private orderService: OrderService;

	constructor() {
		this.orderService = new OrderService();
	}

	createOrderStatus = async (
		req: Request,
		res: Response,
		next: NextFunction,
	) => {
		try {
			const statusName = (req as any).validatedValue.statusName;

			const newStatus =
				await this.orderService.createOrderStatus(statusName);

			if (!newStatus) {
				return responseSender(
					res,
					500,
					"Order status creation failed. Please try again.",
				);
			}

			return responseSender(
				res,
				201,
				"Order status created successfully.",
			);
		} catch (err: any) {
			console.log(
				"Error occured while creating order status: ".red,
				err.message,
			);
			next(err);
		}
	};

	editOrderStatus = async (
		req: Request,
		res: Response,
		next: NextFunction,
	) => {
		try {
			const statusName = (req as any).validatedValue.statusName;
			const orderStatusId = (req as any).validatedValue.orderStatusId;

			const isUpdated = await this.orderService.editOrderStatus(
				statusName,
				orderStatusId,
			);

			if (!isUpdated) {
				return responseSender(
					res,
					500,
					"Order status edit failed. Please try again.",
				);
			}

			return responseSender(
				res,
				201,
				"Order status updated successfully.",
			);
		} catch (err: any) {
			console.log(
				"Error occured while creating order status: ".red,
				err.message,
			);
			next(err);
		}
	};

	createOrder = async (req: Request, res: Response, next: NextFunction) => {
		try {
			console.log((req as any).validatedValue);

			const newOrder = {
				customerId: (req as any).validatedValue.customerId,
				staffId: (req as any).validatedValue.staffId,
				statusId: (req as any).validatedValue.statusId,
				billingAddress: (req as any).validatedValue.billingAddress,
				billingAddressCity: (req as any).validatedValue
					.billingAddressCity,
				billingAddressPostCode: (req as any).validatedValue
					.billingAddressPostCode,
				deliveryMethod: (req as any).validatedValue.deliveryMethod,
				deliveryDate: (req as any).validatedValue.deliveryDate,
				orderItems: (req as any).validatedValue.orderItems,
				payments: (req as any).validatedValue.orderItems,
				couponId: (req as any).validatedValue.couponId,
			};

			const createdOrder = await this.orderService.createOrder(
				newOrder.customerId,
				newOrder.staffId,
				newOrder.statusId,
				newOrder.billingAddress,
				newOrder.billingAddressCity,
				newOrder.billingAddressPostCode,
				newOrder.deliveryMethod,
				newOrder.orderItems,
				newOrder.payments,
				newOrder.deliveryDate,
				newOrder.couponId,
			);

			if (!createdOrder) {
				return responseSender(
					res,
					500,
					"Order creation failed. Please try again.",
				);
			}
			return responseSender(res, 201, "Order created successfully.", {
				order: createdOrder,
			});
		} catch (err: any) {
			console.log(
				"Error occured while creating order: ".red,
				err.message,
			);
			next(err);
		}
	};

	getAllOrderStatuses = async (
		req: Request,
		res: Response,
		next: NextFunction,
	) => {
		try {
			const searchTerm = (req as any).validatedValue.searchTerm;
			const currentPage = parseInt((req as any).validatedValue.page || 1);
			const limitPerPage = parseInt(
				(req as any).validatedValue.limit || 20,
			);
			const offset = (currentPage - 1) * limitPerPage;
			const order: Order = [["createdAt", "DESC"]];
			const filter: WhereOptions<OrderStatusAttributes> = {};

			const orderStatuses = await this.orderService.getAllOrderStatuses(
				filter,
				limitPerPage,
				offset,
				order,
			);
			if (!orderStatuses) {
				return responseSender(
					res,
					400,
					"Failed to get orders. Please try again.",
				);
			}
			return responseSender(
				res,
				200,
				"Order statuses fetched successfully.",
				{
					orderStatuses,
				},
			);
		} catch (err: any) {
			console.log(
				"Error occured while fetching order status: ".red,
				err.message,
			);
			next(err);
		}
	};

	getAllOrders = async (req: Request, res: Response, next: NextFunction) => {
		try {
			const searchTerm = (req as any).validatedValue.searchTerm;
			const currentPage = parseInt((req as any).validatedValue.page || 1);
			const limitPerPage = parseInt(
				(req as any).validatedValue.limit || 20,
			);
			const offset = (currentPage - 1) * limitPerPage;
			const order: Order = [["createdAt", "DESC"]];
			const filter: WhereOptions<OrderAttributes> = {};

			const orders = await this.orderService.getAllOrders(
				filter,
				limitPerPage,
				offset,
				order,
			);
			if (!orders) {
				return responseSender(
					res,
					400,
					"Failed to get orders. Please try again.",
				);
			}
			return responseSender(res, 200, "Orders fetched successfully.", {
				orders,
			});
		} catch (err: any) {
			console.log(
				"Error occured while fetching order: ".red,
				err.message,
			);
			next(err);
		}
	};
}

export default OrderController;
