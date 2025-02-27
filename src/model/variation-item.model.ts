import {
	Table,
	Column,
	Model,
	DataType,
	PrimaryKey,
	AutoIncrement,
	ForeignKey,
	BelongsTo,
	BelongsToMany,
} from "sequelize-typescript";
import Variation from "@/model/variation.model";
import Product from "./product.model";
import ProductVariationItem from "./product-variation-item.model";

export interface VariationItemAttributes {
	variationItemId: number;
	value: string;
	additionalPrice: number;
	variationId: number;
	createdAt: Date;
	updatedAt: Date;
}

export interface VariationItemCreationAttributes {
	value: string;
	additionalPrice: number;
	variationId: number;
}

@Table({ tableName: "VariationItem", timestamps: true })
class VariationItem extends Model<
	VariationItemAttributes,
	VariationItemCreationAttributes
> {
	@PrimaryKey
	@AutoIncrement
	@Column(DataType.INTEGER)
	declare variationItemId: number;

	@Column({ type: DataType.STRING, allowNull: false })
	declare value: string;

	@Column({ type: DataType.FLOAT, defaultValue: 0 })
	declare additionalPrice: number;

	@ForeignKey(() => Variation)
	@Column({ type: DataType.INTEGER, allowNull: false })
	declare variationId: number;

	@BelongsTo(() => Variation)
	declare variation: Variation;

	@BelongsToMany(() => Product, () => ProductVariationItem)
	declare product?: Product;
}

export default VariationItem;
