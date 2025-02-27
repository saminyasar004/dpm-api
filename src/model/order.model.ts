import {
	Table,
	Column,
	Model,
	PrimaryKey,
	AutoIncrement,
	ForeignKey,
	BelongsTo,
	HasMany,
	DataType,
} from "sequelize-typescript";
import Customer from "./customer.model";
import Staff from "./staff.model";
import OrderStatus from "./order-status.model";
import OrderItem from "./order-item.model";
import PaymentDetails from "./payment-details.model";

export interface OrderAttributes {
	orderId: number;
	customerId: number;
	staffId: number;
	statusId: number;
	orderItems: OrderItem[];
	payments: PaymentDetails[];
	createdAt: Date;
	deletedAt: Date;
}

export interface OrderCreationAttributes {
	orderId: number;
	customerId: number;
	staffId: number;
	statusId: number;
	orderItems: OrderItem[];
	payments: PaymentDetails[];
}

@Table({ tableName: "Orders", timestamps: true })
export default class Order extends Model<
	OrderAttributes,
	OrderCreationAttributes
> {
	@PrimaryKey
	@AutoIncrement
	@Column(DataType.INTEGER)
	declare orderId: number;

	@ForeignKey(() => Customer)
	@Column(DataType.INTEGER)
	declare customerId: number;

	@ForeignKey(() => Staff)
	@Column(DataType.INTEGER)
	declare staffId: number;

	@ForeignKey(() => OrderStatus)
	@Column(DataType.INTEGER)
	declare statusId: number;

	@BelongsTo(() => Customer)
	declare customer: Customer;

	@BelongsTo(() => Staff)
	declare staff: Staff;

	@BelongsTo(() => OrderStatus)
	declare status: OrderStatus;

	@HasMany(() => OrderItem)
	declare orderItems: OrderItem[];

	@HasMany(() => PaymentDetails)
	declare payments: PaymentDetails[];
}
