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
import Coupon from "./coupon.model";

export interface OrderAttributes {
	orderId: number;
	customerId: number;
	staffId: number;
	statusId: number;
	deliveryMethod: "shop-pickup" | "courier";
	billingAddress: string;
	billingAddressCity: string;
	billingAddressPostCode: string;
	additionalNotes: string;
	deliveryDate: Date;
	couponId?: number;
	orderItems: OrderItem[];
	payments: PaymentDetails[];
	createdAt: Date;
	deletedAt: Date;
}

export interface OrderCreationAttributes {
	customerId: number;
	staffId: number;
	statusId: number;
	couponId?: number;
	deliveryMethod: "shop-pickup" | "courier";
	billingAddress: string;
	billingAddressCity: string;
	billingAddressPostCode: string;
	deliveryDate: Date;
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

	@ForeignKey(() => Coupon)
	@Column({ type: DataType.INTEGER, allowNull: true })
	declare couponId?: number;

	@ForeignKey(() => OrderStatus)
	@Column(DataType.INTEGER)
	declare statusId: number;

	@Column({ type: DataType.STRING, allowNull: false })
	declare billingAddress: string;

	@Column({ type: DataType.STRING, allowNull: false })
	declare billingAddressCity: string;

	@Column({ type: DataType.STRING, allowNull: false })
	declare billingAddressPostCode: string;

	@Column({
		type: DataType.ENUM("shop-pickup", "courier"),
		defaultValue: "shop-pickup",
		allowNull: false,
	})
	declare deliveryMethod: "shop-pickup" | "courier";

	@Column({ type: DataType.DATE, allowNull: true })
	declare deliveryDate: Date | null;

	@BelongsTo(() => Customer)
	declare customer: Customer;

	@BelongsTo(() => Staff)
	declare staff: Staff;

	@BelongsTo(() => Coupon)
	declare coupon: Coupon;

	@BelongsTo(() => OrderStatus)
	declare status: OrderStatus;

	@HasMany(() => OrderItem, { as: "orderItems" })
	declare orderItems: OrderItem[];

	@HasMany(() => PaymentDetails, { as: "payments" })
	declare payments: PaymentDetails[];
}
