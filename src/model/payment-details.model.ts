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

export interface PaymentDetailsAttributes {
	paymentId: number;
	orderId: number;
	paymentMethod: string;
	amount: number;
	createdAt: Date;
	deletedAt: Date;
}

export interface PaymentDetailsCreationAttributes {
	orderId: number;
	paymentMethod: string;
	amount: number;
}

@Table({ tableName: "PaymentDetails", timestamps: true })
export default class PaymentDetails extends Model<
	PaymentDetailsAttributes,
	PaymentDetailsCreationAttributes
> {
	@PrimaryKey
	@AutoIncrement
	@Column(DataType.INTEGER)
	declare paymentID: number;

	@ForeignKey(() => Order)
	@Column(DataType.INTEGER)
	declare orderId: number;

	@Column(DataType.STRING)
	declare paymentMethod: string;

	@Column(DataType.FLOAT)
	declare amount: number;

	@BelongsTo(() => Order)
	declare order: Order;
}
