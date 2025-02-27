import {
	Table,
	Column,
	Model,
	DataType,
	PrimaryKey,
	AutoIncrement,
	Default,
	HasMany,
} from "sequelize-typescript";
import Order from "./order.model";

export interface StaffAttributes {
	staffId: number;
	name: string;
	email: string;
	phone: string;
	password: string;
	role: "agent" | "designer";
	commissionPercentage: number;
	avatar: string;
	tokenVersion: number;
	status: "online" | "offline";
	orders: Order[];
	createdAt: Date;
	updatedAt: Date;
}

export interface StaffCreationAttributes {
	name: string;
	email: string;
	phone: string;
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
	declare staffId: number;

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
	declare password: string;

	@Column({
		type: DataType.ENUM("agent", "designer"), // Define ENUM values
		defaultValue: "agent",
		allowNull: false,
	})
	declare role: "agent" | "designer";

	@Column({
		type: DataType.INTEGER,
		allowNull: false,
	})
	declare commissionPercentage: number;

	@Default("null")
	@Column({
		type: DataType.STRING,
		allowNull: false,
	})
	declare avatar: string;

	@Default(0)
	@Column(DataType.INTEGER)
	declare tokenVersion: number;

	@Default("offline")
	@Column({
		type: DataType.ENUM("online", "offline"),
		allowNull: false,
	})
	declare status: "online" | "offline";

	@HasMany(() => Order)
	declare orders: Order[];
}

export default Staff;
