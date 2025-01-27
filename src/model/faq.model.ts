import {
	Table,
	Column,
	Model,
	PrimaryKey,
	AutoIncrement,
	DataType,
	AllowNull,
	HasMany,
} from "sequelize-typescript";
import FaqItem, { FaqItemAttributes } from "./faq-item.model";

export interface FaqAttributes {
	faqId: number;
	faqTitle: string;
	faqItems: FaqItem[] | FaqItemAttributes[];
	createdAt: Date;
	updatedAt: Date;
}

export interface FaqCreationAttributes {
	faqTitle: string;
}

@Table({
	tableName: "Faqs",
	timestamps: true,
})
class Faq extends Model<FaqAttributes, FaqCreationAttributes> {
	@PrimaryKey
	@AutoIncrement
	@Column(DataType.INTEGER)
	declare faqId: number;

	@AllowNull(false)
	@Column(DataType.STRING)
	declare faqTitle: string;

	@HasMany(() => FaqItem)
	declare faqItems: FaqItem[];
}

export default Faq;
