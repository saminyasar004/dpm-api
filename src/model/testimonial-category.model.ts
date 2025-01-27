import {
	Table,
	Column,
	Model,
	PrimaryKey,
	AutoIncrement,
	DataType,
	AllowNull,
} from "sequelize-typescript";

export interface TestimonialCategoryAttributes {
	testimonialCategoryId: number;
	title: string;
	description: string;
	createdAt: Date;
	updatedAt: Date;
}

export interface TestimonialCategoryCreationAttributes {
	title: string;
	description: string;
}

@Table({
	tableName: "TestimonialCategories",
	timestamps: true,
})
class TestimonialCategory extends Model<
	TestimonialCategoryAttributes,
	TestimonialCategoryCreationAttributes
> {
	@PrimaryKey
	@AutoIncrement
	@Column(DataType.INTEGER)
	declare testimonialCategoryId: number;

	@AllowNull(false)
	@Column(DataType.STRING)
	declare title: string;

	@AllowNull(false)
	@Column(DataType.STRING)
	declare description: string;
}

export default TestimonialCategory;
