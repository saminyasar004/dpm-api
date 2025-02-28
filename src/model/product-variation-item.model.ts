import {
	Table,
	Column,
	Model,
	DataType,
	ForeignKey,
} from "sequelize-typescript";
import Product from "./product.model";
import VariationItem from "./variation-item.model";

export interface ProductVariationItemAttributes {
	productId: number;
	variationItemId: number;
	createdAt: Date;
	updatedAt: Date;
}

export interface ProductVariationItemCreationAttributes {
	productId: number;
	variationItemId: number;
}

@Table({ tableName: "ProductVariationItem", timestamps: true })
class ProductVariationItem extends Model<
	ProductVariationItemAttributes,
	ProductVariationItemCreationAttributes
> {
	@ForeignKey(() => Product)
	@Column({ type: DataType.STRING, allowNull: false })
	declare productId: number;

	@ForeignKey(() => VariationItem)
	@Column({ type: DataType.STRING, allowNull: false })
	declare variationItemId: number;
}

export default ProductVariationItem;
