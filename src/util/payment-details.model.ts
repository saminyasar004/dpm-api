import { Model } from "sequelize";
import {
	AutoIncrement,
	BelongsTo,
	Column,
	DataType,
	ForeignKey,
	PrimaryKey,
	Table,
} from "sequelize-typescript";
import Order from "../model/order.model";

export interface PaymentDetailsAttributes {
	paymentId: number;
	orderId: number;
	paymentMethod: string;
	paymentStatus: string;
	transactionId?: string;
	amount: number;
	currency: string;
	paymentDate: Date;
	createdAt: Date;
	updatedAt: Date;
}

export interface PaymentDetailsCreationAttributes {
	orderId: number;
	paymentMethod: string;
	paymentStatus: string;
	transactionId?: string;
	amount: number;
	currency: string;
	paymentDate: Date;
}

@Table({ tableName: "PaymentDetails", timestamps: true })
class PaymentDetails extends Model<
	PaymentDetailsAttributes,
	PaymentDetailsCreationAttributes
> {
	@PrimaryKey
	@AutoIncrement
	@Column(DataType.INTEGER)
	declare paymentId: number;

	@ForeignKey(() => Order)
	@Column({ type: DataType.INTEGER, allowNull: false, unique: true })
	declare orderId: number;

	@Column({ type: DataType.STRING, allowNull: false })
	declare paymentMethod: string;

	@Column({ type: DataType.STRING, allowNull: false })
	declare paymentStatus: string;

	@Column({ type: DataType.STRING, allowNull: true })
	declare transactionId?: string;

	@Column({ type: DataType.DECIMAL(10, 2), allowNull: false })
	declare amount: number;

	@Column({ type: DataType.STRING, allowNull: false })
	declare currency: string;

	@Column({ type: DataType.DATE, allowNull: false })
	declare paymentDate: Date;

	@BelongsTo(() => Order, "orderId")
	declare order?: Order;
}

export default PaymentDetails;
