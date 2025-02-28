import {
	Table,
	Column,
	Model,
	DataType,
	PrimaryKey,
	AutoIncrement,
	ForeignKey,
	BelongsTo,
	HasMany,
	BelongsToMany,
} from "sequelize-typescript";
import ProductCategory from "./product-category.model";
import ProductAttribute from "./product-attribute.model";
import ProductBulkDiscount from "./product-bulk-discount.model";
import ProductImage from "./product-image.model";
import ProductReview from "./product-review.model";
import ProductTag from "./product-tags.model";
import ProductVariationItem from "./product-variation-item.model";

export interface ProductModelAttributes {
	productId: number;
	name: string;
	description: string;
	slug: string;
	sku: string;
	basePrice: number;
	minOrderQuantity: number;
	pricingType: "flat" | "square-feet";
	isActive: boolean;
	categoryId: number | null;
	attributes: ProductAttribute[];
	bulkDiscounts: ProductBulkDiscount[];
	variationItems: ProductVariationItem[];
	images: ProductImage[];
	tags: ProductTag[];
	reviews: ProductReview[];
	createdAt: Date;
	updatedAt: Date;
}

export interface ProductModelCreationAttributes {
	name: string;
	description: string;
	slug: string;
	sku: string;
	basePrice: number;
	minOrderQuantity: number;
	pricingType: "flat" | "square-feet";
	isActive: boolean;
	categoryId: number | null;
}

@Table({ tableName: "Products", timestamps: true })
class Product extends Model<
	ProductModelAttributes,
	ProductModelCreationAttributes
> {
	@PrimaryKey
	@AutoIncrement
	@Column(DataType.INTEGER)
	declare productId: number;

	@Column({ type: DataType.STRING, allowNull: false })
	declare name: string;

	@Column({ type: DataType.TEXT, allowNull: false })
	declare description: string;

	@Column({ type: DataType.STRING, allowNull: false })
	declare slug: string;

	@Column({ type: DataType.STRING, allowNull: false })
	declare sku: string;

	@Column({ type: DataType.FLOAT, allowNull: false })
	declare basePrice: number;

	@Column({ type: DataType.INTEGER, allowNull: false })
	declare minOrderQuantity: number;

	@Column({ type: DataType.ENUM("flat", "square-feet"), allowNull: false })
	declare pricingType: number;

	@Column({ type: DataType.BOOLEAN, defaultValue: true })
	declare isActive: boolean;

	@ForeignKey(() => ProductCategory)
	@Column({ type: DataType.INTEGER, allowNull: true })
	declare categoryId: number | null;

	@BelongsTo(() => ProductCategory)
	declare category?: ProductCategory;

	@HasMany(() => ProductAttribute, { as: "attributes" })
	declare attributes: ProductAttribute[];

	@HasMany(() => ProductVariationItem, { as: "variationItems" })
	declare variationItems: ProductVariationItem[];

	@HasMany(() => ProductBulkDiscount, { as: "bulkDiscounts" })
	declare bulkDiscounts: ProductBulkDiscount[];

	@HasMany(() => ProductImage, { as: "images" })
	declare images: ProductImage[];

	@HasMany(() => ProductTag, { as: "tags" })
	declare tas: ProductTag[];

	@HasMany(() => ProductReview, { as: "reviews" })
	declare reviews: ProductReview[];
}

export default Product;
