import {
	Table,
	Column,
	Model,
	DataType,
	PrimaryKey,
	AutoIncrement,
	Default,
} from "sequelize-typescript";

export interface InqueryAttributes {
	inqueryId: number;
	name: string;
	email: string;
	phone: string;
	company: string;
	inqueryType: string;
	message: string;
	designFile: string;
	status: "open" | "closed";
	createdAt: Date;
	updatedAt: Date;
}

export interface InqueryCreationAttributes {
	name: string;
	email: string;
	phone: string;
	company: string;
	inqueryType: string;
	message: string;
	designFile: string;
	status: "open" | "closed";
}

@Table({
	tableName: "Inqueries",
	timestamps: true,
})
class Inquery extends Model<InqueryAttributes, InqueryCreationAttributes> {
	@PrimaryKey
	@AutoIncrement
	@Column(DataType.INTEGER)
	declare inqueryId: number;

	@Column({
		type: DataType.STRING,
		allowNull: false,
	})
	declare name: string;

	@Column({
		type: DataType.STRING,
		allowNull: false,
	})
	declare email: string;

	@Column({
		type: DataType.STRING,
		allowNull: false,
	})
	declare phone: string;

	@Column({
		type: DataType.STRING,
		allowNull: false,
	})
	declare company: string;

	@Column({
		type: DataType.STRING,
		allowNull: false,
	})
	declare inqueryType: string;

	@Column({
		type: DataType.TEXT,
		allowNull: false,
	})
	declare message: string;

	@Default("null")
	@Column({
		type: DataType.STRING,
		allowNull: false,
	})
	declare designFile: string;

	@Column({
		type: DataType.ENUM("open", "closed"),
		allowNull: false,
	})
	declare status: "open" | "closed";
}

export default Inquery;
