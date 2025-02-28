import {
	Table,
	Column,
	Model,
	DataType,
	PrimaryKey,
	AutoIncrement,
	ForeignKey,
	BelongsTo,
} from "sequelize-typescript";
import OrderItemVariation from "./order-item-variation.model";

export interface OrderItemVariationItemAttributes {
	variationItemId: number;
	value: string;
	additionalPrice: number;
	variationId: number;
	createdAt: Date;
	updatedAt: Date;
}

export interface OrderItemVariationItemCreationAttributes {
	value: string;
	additionalPrice: number;
	variationId: number;
}

@Table({ tableName: "OrderItemVariationItem", timestamps: true })
class OrderItemVariationItem extends Model<
	OrderItemVariationItemAttributes,
	OrderItemVariationItemCreationAttributes
> {
	@PrimaryKey
	@AutoIncrement
	@Column(DataType.INTEGER)
	declare variationItemId: number;

	@Column({ type: DataType.STRING, allowNull: false })
	declare value: string;

	@Column({ type: DataType.FLOAT, defaultValue: 0 })
	declare additionalPrice: number;

	@ForeignKey(() => OrderItemVariation)
	@Column({ type: DataType.INTEGER, allowNull: false })
	declare variationId: number;

	@BelongsTo(() => OrderItemVariation)
	declare variation: OrderItemVariation;
}

export default OrderItemVariationItem;
