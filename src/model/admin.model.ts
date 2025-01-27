import {
	Table,
	Column,
	Model,
	DataType,
	PrimaryKey,
	AutoIncrement,
	Default,
} from "sequelize-typescript";

export interface AdminAttributes {
	adminId: number;
	name: string;
	email: string;
	password: string;
	avatar: string;
	tokenVersion: number;
	createdAt: Date;
	updatedAt: Date;
}

export interface AdminCreationAttributes {
	name: string;
	email: string;
	password: string;
}

@Table({
	tableName: "Admins",
	timestamps: true,
})
class Admin extends Model<AdminAttributes, AdminCreationAttributes> {
	@PrimaryKey
	@AutoIncrement
	@Column(DataType.INTEGER)
	declare adminId: number;

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
	declare password: string;

	@Default("null")
	@Column({
		type: DataType.STRING,
		allowNull: false,
	})
	declare avatar: string;

	@Default(0)
	@Column(DataType.INTEGER)
	declare tokenVersion: number;
}

export default Admin;
