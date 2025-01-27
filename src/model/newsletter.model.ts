import {
	Table,
	Column,
	Model,
	DataType,
	PrimaryKey,
	AutoIncrement,
} from "sequelize-typescript";

export interface NewsletterAttributes {
	newsletterId: number;
	email: string;
	verified: boolean;
	verificationToken: string;
	createdAt: Date;
	updatedAt: Date;
}

export interface NewsletterCreationAttributes {
	email: string;
	verified: boolean;
	verificationToken: string;
}

@Table({
	tableName: "Newsletters",
	timestamps: true,
})
class Newsletter extends Model<
	NewsletterAttributes,
	NewsletterCreationAttributes
> {
	@PrimaryKey
	@AutoIncrement
	@Column(DataType.INTEGER)
	newsletterId!: number;

	@Column({
		type: DataType.STRING,
		allowNull: false,
	})
	email!: string;

	@Column({
		type: DataType.BOOLEAN,
		allowNull: false,
	})
	verified!: boolean;

	@Column({
		type: DataType.STRING,
		allowNull: false,
	})
	verificationToken!: string;
}

export default Newsletter;
