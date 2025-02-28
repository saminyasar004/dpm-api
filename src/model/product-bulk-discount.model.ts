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
import Product from "./product.model";

export interface ProductBulkDiscountAttributes {
	bulkDiscountId: number;
	minQuantity: number;
	maxQuantity: number;
	discountPercentage: number;
	productId: number;
	createdAt: Date;
	updatedAt: Date;
}

export interface ProductBulkDiscountCreationAttributes {
	minQuantity: number;
	maxQuantity: number;
	discountPercentage: number;
	productId: number;
}

@Table({
	tableName: "ProductBulkDiscounts",
	timestamps: true,
})
class ProductBulkDiscount extends Model<
	ProductBulkDiscountAttributes,
	ProductBulkDiscountCreationAttributes
> {
	@PrimaryKey
	@AutoIncrement
	@Column(DataType.INTEGER)
	declare bulkDiscountId: number;

	@Column({ type: DataType.INTEGER, allowNull: false })
	declare minQuantity: number;

	@Column({ type: DataType.INTEGER, allowNull: false })
	declare maxQuantity: number;

	@Column({ type: DataType.FLOAT, allowNull: false })
	declare discountPercentage: number;

	@ForeignKey(() => Product)
	@Column({ type: DataType.INTEGER, allowNull: false })
	declare productId: number;

	@BelongsTo(() => Product)
	declare product?: Product;
}

export default ProductBulkDiscount;
