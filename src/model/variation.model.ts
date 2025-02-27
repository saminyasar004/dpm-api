import {
	Table,
	Column,
	Model,
	DataType,
	PrimaryKey,
	AutoIncrement,
	HasMany,
	BelongsTo,
	ForeignKey,
	BelongsToMany,
} from "sequelize-typescript";
import VariationItem from "@/model/variation-item.model";
import Product from "@/model/product.model";
import ProductVariationItem from "./product-variation-item.model";

export interface VariationAttributes {
	variationId: number;
	name: string;
	unit: string;
	variationItems: VariationItem[];
	createdAt: Date;
	updatedAt: Date;
}

export interface VariationCreationAttributes {
	name: string;
	unit: string;
}

@Table({ tableName: "Variations", timestamps: true })
class Variation extends Model<
	VariationAttributes,
	VariationCreationAttributes
> {
	@PrimaryKey
	@AutoIncrement
	@Column(DataType.INTEGER)
	declare variationId: number;

	@Column({ type: DataType.STRING, allowNull: false })
	declare name: string;

	@Column({ type: DataType.STRING, allowNull: false })
	declare unit: string;

	@HasMany(() => VariationItem, { as: "variationItems" })
	declare variationItems: VariationItem[];
}

export default Variation;
