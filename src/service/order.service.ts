import Order, { OrderAttributes } from "../model/order.model";
import StaffService from "./staff.service";
import OrderStatus, {
	OrderStatusAttributes,
} from "../model/order-status.model";
import OrderItem, {
	OrderItemCreationAttributes,
} from "../model/order-item.model";
import PaymentDetails, {
	PaymentDetailsCreationAttributes,
} from "../model/payment-details.model";
import { WhereOptions, Order as SequelizeOrder } from "sequelize";

class OrderService {
	private staffService: StaffService;
	constructor() {
		this.staffService = new StaffService();
	}

	createOrderStatus = async (
		statusName: string,
	): Promise<OrderStatus | OrderStatusAttributes | null> => {
		try {
			const newStatus = await OrderStatus.create({ name: statusName });

			return newStatus ? newStatus.toJSON() : null;
		} catch (err: any) {
			console.error(
				"Error occurred while creating order status: ",
				err.message,
			);
			throw err;
		}
	};

	editOrderStatus = async (
		statusName: string,
		orderStatusId: number,
	): Promise<boolean> => {
		try {
			const status = await OrderStatus.findByPk(orderStatusId);

			if (status) {
				const isUpdated = await OrderStatus.update(
					{
						name: statusName,
					},
					{ where: { orderStatusId } },
				);

				if (isUpdated) return true;
			}
			return false;
		} catch (err: any) {
			console.error(
				"Error occurred while creating order status: ",
				err.message,
			);
			throw err;
		}
	};

	createOrder = async (
		customerId: number,
		staffId: number,
		statusId: number,
		billingAddress: string,
		billingAddressCity: string,
		billingAddressPostCode: string,
		deliveryMethod: "shop-pickup" | "courier",
		orderItems: OrderItemCreationAttributes[],
		payments: PaymentDetailsCreationAttributes[],
		deliveryDate: Date,
		couponId?: number,
	): Promise<Order | OrderAttributes | null> => {
		try {
			const newOrder = await Order.create({
				customerId,
				staffId,
				statusId,
				billingAddress,
				billingAddressCity,
				billingAddressPostCode,
				deliveryMethod,
				deliveryDate,
				couponId,
			});

			if (orderItems.length > 0) {
				await OrderItem.bulkCreate(
					orderItems.map((orderItem) => ({
						...orderItem,
						orderId: newOrder.orderId,
					})),
				);
			}

			if (payments.length > 0) {
				await PaymentDetails.bulkCreate(
					payments.map((payments) => ({
						...payments,
						orderId: newOrder.orderId,
					})),
				);
			}

			return newOrder ? newOrder.toJSON() : null;
		} catch (err: any) {
			console.error("Error occurred while creating order: ", err.message);
			throw err;
		}
	};

	getOrderById = async (
		orderId: number,
	): Promise<Order | OrderAttributes | null> => {
		try {
			const order = await Order.findByPk(orderId);

			return order ? order.toJSON() : null;
		} catch (err: any) {
			console.error(
				"Error occurred while fetching order by id: ",
				err.message,
			);
			throw err;
		}
	};

	// updateOrder = async (
	// 	statusId: number,
	// 	orderItems: OrderItemCreationAttributes[],
	// 	payments: PaymentDetailsCreationAttributes[],
	// ): Promise<boolean> => {
	// 	try {

	// 		const [updatedRows] = await Product.update(updateData, {
	// 			where: { productId },
	// 		});
	// 		return updatedRows > 0;
	// 	} catch (err: any) {
	// 		console.error(
	// 			"Error occurred while updating product: ",
	// 			err.message,
	// 		);
	// 		throw err;
	// 	}
	// };

	// deleteOrder = async (productId: number): Promise<boolean> => {
	// 	try {
	// 		const product = await Product.findByPk(productId);
	// 		if (product) {
	// 			await product.destroy();
	// 			return true;
	// 		}
	// 		return false;
	// 	} catch (err: any) {
	// 		console.error(
	// 			"Error occurred while deleting product: ",
	// 			err.message,
	// 		);
	// 		throw err;
	// 	}
	// };

	getAllOrderStatuses = async (
		filter: WhereOptions<OrderStatus>,
		limit: number,
		offset: number,
		order: SequelizeOrder,
	): Promise<OrderStatus[] | OrderStatusAttributes[] | null> => {
		try {
			const orderStatuses = await OrderStatus.findAll({
				where: filter,
				limit,
				offset,
				order,
			});

			return orderStatuses.map((product) => product.toJSON());
		} catch (err: any) {
			console.error(
				"Error occurred while fetching orders: ",
				err.message,
			);
			throw err;
		}
	};

	getAllOrders = async (
		filter: WhereOptions<OrderAttributes>,
		limit: number,
		offset: number,
		order: SequelizeOrder,
	): Promise<Order[] | OrderAttributes[] | null> => {
		try {
			const orders = await Order.findAll({
				where: filter,
				limit,
				offset,
				order,
				include: [
					{ model: OrderItem, as: "orderItems" },
					{ model: PaymentDetails, as: "payments" },
				],
			});

			return orders.map((product) => product.toJSON());
		} catch (err: any) {
			console.error(
				"Error occurred while fetching orders: ",
				err.message,
			);
			throw err;
		}
	};
}

export default OrderService;
