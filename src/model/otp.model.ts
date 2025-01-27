import {
	Table,
	Column,
	Model,
	DataType,
	PrimaryKey,
	AutoIncrement,
} from "sequelize-typescript";

export interface OtpAttributes {
	OtpId: number;
	requestId: number;
	code: string;
	expiresAt: Date;
	used: boolean;
	createdAt: Date;
	updatedAt: Date;
}

export interface OtpCreationAttributes {
	requestId: number;
	code: string;
	expiresAt: Date;
	used: boolean;
}

@Table({
	tableName: "Otps",
	timestamps: true,
})
class Otp extends Model<OtpAttributes, OtpCreationAttributes> {
	@PrimaryKey
	@AutoIncrement
	@Column(DataType.INTEGER)
	OtpId!: number;

	@Column(DataType.INTEGER)
	requestId!: number;

	@Column({
		type: DataType.STRING,
		allowNull: false,
	})
	code!: string;

	@Column({
		type: DataType.DATE,
		allowNull: false,
	})
	expiresAt!: Date;

	@Column({
		type: DataType.BOOLEAN,
		defaultValue: false,
	})
	used!: boolean;
}

export default Otp;
