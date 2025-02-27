import {
	Table,
	Column,
	Model,
	PrimaryKey,
	AutoIncrement,
	DataType,
	AllowNull,
	ForeignKey,
} from "sequelize-typescript";
import TestimonialCategory from "@/model/testimonial-category.model";

export interface TestimonialAttributes {
	testimonialId: number;
	testimonialCategoryId: number;
	title: string;
	description: string;
	image: string;
	createdAt: Date;
	updatedAt: Date;
}

export interface TestimonialCreationAttributes {
	title: string;
	description: string;
	image: string;
}

@Table({
	tableName: "Testimonials",
	timestamps: true,
})
class Testimonial extends Model<
	TestimonialAttributes,
	TestimonialCreationAttributes
> {
	@PrimaryKey
	@AutoIncrement
	@Column(DataType.INTEGER)
	declare testimonialId: number;

	@ForeignKey(() => TestimonialCategory)
	@Column(DataType.INTEGER)
	declare testimonialCategoryId: number;

	@AllowNull(false)
	@Column(DataType.STRING)
	declare title: string;

	@AllowNull(false)
	@Column(DataType.STRING)
	declare description: string;

	@AllowNull(false)
	@Column(DataType.STRING)
	declare image: string;
}

export default Testimonial;
