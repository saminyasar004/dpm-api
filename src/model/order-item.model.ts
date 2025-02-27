import {
	Table,
	Column,
	Model,
	PrimaryKey,
	AutoIncrement,
	ForeignKey,
	BelongsTo,
	DataType,
} from "sequelize-typescript";
import Order from "./order.model";

export interface OrderItemAttributes {
	orderItemId: number;
	orderId: number;
	productName: string;
	quantity: number;
	price: number;
	createdAt: Date;
	deletedAt: Date;
}

export interface OrderItemCreationAttributes {
	orderItemId: number;
	orderId: number;
	productName: string;
	quantity: number;
	price: number;
}

@Table({ tableName: "OrderItems", timestamps: true })
export default class OrderItem extends Model<
	OrderItemAttributes,
	OrderItemCreationAttributes
> {
	@PrimaryKey
	@AutoIncrement
	@Column(DataType.INTEGER)
	declare orderItemId: number;

	@ForeignKey(() => Order)
	@Column(DataType.INTEGER)
	declare orderId: number;

	@Column(DataType.STRING)
	declare productName: string;

	@Column(DataType.INTEGER)
	declare quantity: number;

	@Column(DataType.FLOAT)
	declare price: number;

	@BelongsTo(() => Order)
	declare order: Order;
}
