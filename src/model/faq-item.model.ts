import {
	Table,
	Column,
	Model,
	PrimaryKey,
	AutoIncrement,
	DataType,
	AllowNull,
	ForeignKey,
	BelongsTo,
} from "sequelize-typescript";

import Faq from "./faq.model";

export interface FaqItemAttributes {
	faqItemId: number;
	faqId: number;
	question: string;
	answer: string;
	createdAt: Date;
	updatedAt: Date;
}

export interface FaqItemCreationAttributes {
	faqId: number;
	question: string;
	answer: string;
}

@Table({
	tableName: "FaqItems",
	timestamps: true,
})
class FaqItem extends Model<FaqItemAttributes, FaqItemCreationAttributes> {
	@PrimaryKey
	@AutoIncrement
	@Column(DataType.INTEGER)
	declare faqItemId: number;

	@ForeignKey(() => Faq) // Foreign key to the Faq model
	@Column(DataType.INTEGER)
	declare faqId: number;

	@AllowNull(false)
	@Column(DataType.STRING)
	declare question: string;

	@AllowNull(false)
	@Column(DataType.TEXT)
	declare answer: string;

	@BelongsTo(() => Faq)
	declare faq: Faq;
}

export default FaqItem;
