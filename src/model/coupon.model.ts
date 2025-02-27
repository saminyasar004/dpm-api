import {
	Table,
	Column,
	Model,
	DataType,
	PrimaryKey,
	AutoIncrement,
	Default,
} from "sequelize-typescript";

export interface CouponAttributes {
	couponId: number;
	name: string;
	code: string;
	discountAmount: number;
	minimumAmount: number;
	startDate: Date;
	endDate: Date;
	isActive: boolean;
	categoryId: number | null;
	createdAt: Date;
	updatedAt: Date;
}

export interface CopuonCreationAttributes {
	name: string;
	code: string;
	discountAmount: number;
	minimumAmount: number;
	startDate: Date;
	endDate: Date;
	isActive: boolean;
	categoryId: number | null;
}

@Table({ tableName: "Coupons", timestamps: true })
class Coupon extends Model<CouponAttributes, CopuonCreationAttributes> {
	@PrimaryKey
	@AutoIncrement
	@Column(DataType.INTEGER)
	declare couponId: number;

	@Column({ type: DataType.STRING, allowNull: false })
	declare name: string;

	@Column({ type: DataType.STRING, allowNull: false })
	declare code: string;

	@Column({ type: DataType.INTEGER, allowNull: false })
	declare discountAmount: number;

	@Column({ type: DataType.INTEGER, allowNull: false })
	declare minimumAmount: number;

	@Column({ type: DataType.DATE, allowNull: false })
	declare startDate: Date;

	@Column({ type: DataType.DATE, allowNull: false })
	declare endDate: Date;

	@Column({ type: DataType.BOOLEAN, defaultValue: true })
	declare isActive: boolean;

	@Default(null)
	@Column({ type: DataType.INTEGER, allowNull: true })
	declare categoryId: number;
}

export default Coupon;
