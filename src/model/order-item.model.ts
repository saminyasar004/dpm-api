import {
	Table,
	Column,
	Model,
	PrimaryKey,
	AutoIncrement,
	ForeignKey,
	BelongsTo,
	DataType,
	HasMany,
} from "sequelize-typescript";
import Order from "./order.model";
import Product from "./product.model";
import OrderItemVariation from "./order-item-variation.model";

export interface OrderItemAttributes {
	orderItemId: number;
	orderId: number;
	productId: number;
	variationItems: OrderItemVariation[];
	quantity: number;
	price: number;
	createdAt: Date;
	deletedAt: Date;
}

export interface OrderItemCreationAttributes {
	orderId: number;
	productId: number;
	variationItems: OrderItemVariation[];
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

	@ForeignKey(() => Product)
	@Column(DataType.INTEGER)
	declare productId: number;

	@HasMany(() => OrderItemVariation)
	declare variationItems: OrderItemVariation[];

	@Column(DataType.INTEGER)
	declare quantity: number;

	@Column(DataType.FLOAT)
	declare price: number;

	@BelongsTo(() => Order)
	declare order: Order;
}
