import {
	Table,
	Column,
	Model,
	DataType,
	PrimaryKey,
	AutoIncrement,
	Default,
} from "sequelize-typescript";

export interface StaffAttributes {
	staffId: number;
	name: string;
	email: string;
	password: string;
	role: "agent" | "designer";
	commissionPercentage: number;
	avatar: string;
	tokenVersion: number;
	createdAt: Date;
	updatedAt: Date;
}

export interface StaffCreationAttributes {
	name: string;
	email: string;
	password: string;
	role: "agent" | "designer";
	commissionPercentage: number;
}

@Table({
	tableName: "Staff",
	timestamps: true,
})
class Staff extends Model<StaffAttributes, StaffCreationAttributes> {
	@PrimaryKey
	@AutoIncrement
	@Column(DataType.INTEGER)
	staffId!: number;

	@Column({
		type: DataType.STRING,
		allowNull: false,
	})
	name!: string;

	@Column({
		type: DataType.STRING,
		allowNull: false,
	})
	email!: string;

	@Column({
		type: DataType.STRING,
		allowNull: false,
	})
	password!: string;

	@Column({
		type: DataType.ENUM("agent", "designer"), // Define ENUM values
		defaultValue: "agent",
		allowNull: false,
	})
	role!: "agent" | "designer";

	@Column({
		type: DataType.INTEGER,
		allowNull: false,
	})
	commissionPercentage!: number;

	@Default("null")
	@Column({
		type: DataType.STRING,
		allowNull: false,
	})
	avatar!: string;

	@Default(0)
	@Column(DataType.INTEGER)
	declare tokenVersion: number;
}

export default Staff;
