import {
	Table,
	Column,
	Model,
	PrimaryKey,
	AutoIncrement,
	HasMany,
	DataType,
} from "sequelize-typescript";
import Order from "./order.model";

export interface OrderStatusAttributes {
	orderStatusId: number;
	name: string;
	createdAt: Date;
	deletedAt: Date;
}

export interface OrderStatusCreationAttributes {
	orderStatusId: number;
	name: string;
}

@Table({ tableName: "OrderStatuses", timestamps: false })
export default class OrderStatus extends Model<
	OrderStatusAttributes,
	OrderStatusCreationAttributes
> {
	@PrimaryKey
	@AutoIncrement
	@Column(DataType.INTEGER)
	declare orderStatusId: number;

	@Column(DataType.STRING)
	declare name: string;

	@HasMany(() => Order)
	declare orders: Order[];
}
