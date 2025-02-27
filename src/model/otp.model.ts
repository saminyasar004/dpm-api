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
	declare OtpId: number;

	@Column(DataType.INTEGER)
	declare requestId: number;

	@Column({
		type: DataType.STRING,
		allowNull: false,
	})
	declare code: string;

	@Column({
		type: DataType.DATE,
		allowNull: false,
	})
	declare expiresAt: Date;

	@Column({
		type: DataType.BOOLEAN,
		defaultValue: false,
	})
	declare used: boolean;
}

export default Otp;
