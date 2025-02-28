import {
	Table,
	Column,
	Model,
	DataType,
	PrimaryKey,
	AutoIncrement,
	Min,
	Max,
	ForeignKey,
	BelongsTo,
	Default,
} from "sequelize-typescript";
import Product from "./product.model";
import Customer from "./customer.model";

export interface ProductReviewAttributes {
	reviewId: number;
	rating: number;
	description: string;
	status: "published" | "unpublished";
	productId: number;
	customerId: number;
	createdAt: Date;
	updatedAt: Date;
}

export interface ProductReviewCreationAttributes {
	rating: number;
	description: string;
	productId: number;
	customerId: number;
}

@Table({ tableName: "ProductReviews", timestamps: true })
class ProductReview extends Model<
	ProductReviewAttributes,
	ProductReviewCreationAttributes
> {
	@PrimaryKey
	@AutoIncrement
	@Column(DataType.INTEGER)
	declare reviewId: number;

	@Min(1)
	@Max(5)
	@Column({ type: DataType.INTEGER, allowNull: false })
	declare rating: number;

	@Column({ type: DataType.STRING, allowNull: false })
	declare description: string;

	@Default("unpublished")
	@Column({
		type: DataType.ENUM("published", "unpublished"),
		allowNull: false,
	})
	declare status: string;

	@ForeignKey(() => Product)
	@Column({ type: DataType.INTEGER, allowNull: false })
	declare productId: number;

	@ForeignKey(() => Customer)
	@Column({ type: DataType.INTEGER, allowNull: false })
	declare customerId: number;

	@BelongsTo(() => Product, { as: "Product" })
	declare product?: Product;

	@BelongsTo(() => Customer, { as: "Customer" })
	declare customer?: Customer;
}

export default ProductReview;
