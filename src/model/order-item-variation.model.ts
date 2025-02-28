import {
	Table,
	Column,
	Model,
	DataType,
	PrimaryKey,
	AutoIncrement,
	HasMany,
	ForeignKey,
} from "sequelize-typescript";
import OrderItemVariationItem from "./order-item-variation-item.model";
import OrderItem from "./order-item.model";

export interface OrderItemVariationAttributes {
	variationId: number;
	name: string;
	unit: string;
	variationItems: OrderItemVariationItem[];
	createdAt: Date;
	updatedAt: Date;
}

export interface OrderItemVariationCreationAttributes {
	name: string;
	unit: string;
}

@Table({ tableName: "OrderItemVariation", timestamps: true })
class OrderItemVariation extends Model<
	OrderItemVariationAttributes,
	OrderItemVariationCreationAttributes
> {
	@PrimaryKey
	@AutoIncrement
	@Column(DataType.INTEGER)
	declare variationId: number;

	@Column({ type: DataType.STRING, allowNull: false })
	declare name: string;

	@Column({ type: DataType.STRING, allowNull: false })
	declare unit: string;

	@HasMany(() => OrderItemVariationItem, { as: "variationItems" })
	declare variationItems: OrderItemVariationItem[];

	@ForeignKey(() => OrderItem)
	@Column({ type: DataType.INTEGER, allowNull: false })
	declare orderItemId: number;
}

export default OrderItemVariation;
