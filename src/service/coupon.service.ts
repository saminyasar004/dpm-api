import Coupon, { CouponAttributes } from "../model/coupon.model";
import { Op, Order, WhereOptions } from "sequelize";

class CouponService {
	// Create a new coupon
	createCoupon = async (
		name: string,
		code: string,
		discountAmount: number,
		minimumAmount: number,
		endDate: Date,
		categoryId: number | null,
	): Promise<Coupon | CouponAttributes | null> => {
		try {
			const coupon = await Coupon.create({
				name,
				code,
				discountAmount,
				minimumAmount,
				startDate: new Date(),
				endDate,
				isActive: true,
				categoryId,
			});

			return coupon ? coupon.toJSON() : null;
		} catch (err: any) {
			console.log("Error creating coupon: ", err.message);
			throw err;
		}
	};

	// Get coupon by ID
	getCouponById = async (
		couponId: number,
	): Promise<Coupon | CouponAttributes | null> => {
		try {
			const coupon = await Coupon.findByPk(couponId);
			return coupon ? coupon.toJSON() : null;
		} catch (err: any) {
			console.log("Error fetching coupon: ", err.message);
			throw err;
		}
	};

	getActiveCouponByCode = async (
		code: string,
	): Promise<Coupon | CouponAttributes | null> => {
		try {
			const coupon = await Coupon.findOne({
				where: {
					code,
					isActive: true,
					endDate: {
						[Op.gte]: new Date(),
					},
				},
			});
			return coupon ? coupon.toJSON() : null;
		} catch (err: any) {
			console.log("Error fetching coupon: ", err.message);
			throw err;
		}
	};

	// Update coupon
	updateCoupon = async (
		couponId: number,
		name: string,
		discountAmount: number,
		minimumAmount: number,
		endDate: Date,
		isActive: boolean,
		categoryId: number,
	): Promise<boolean> => {
		try {
			// Update coupon details
			const [updatedRows] = await Coupon.update(
				{
					name,
					discountAmount,
					minimumAmount,
					endDate,
					isActive,
					categoryId,
				},
				{ where: { couponId } },
			);

			if (updatedRows === 0) return false; // If no coupon was updated, return false

			return true;
		} catch (err: any) {
			console.log("Error updating coupon: ", err.message);
			throw err;
		}
	};

	// Delete coupon
	deleteCoupon = async (couponId: number): Promise<boolean> => {
		try {
			const coupon = await Coupon.findByPk(couponId);
			if (coupon) {
				await coupon.destroy();
				return true;
			}
			return false;
		} catch (err: any) {
			console.log("Error deleting coupon: ", err.message);
			throw err;
		}
	};

	// Get all coupons with optional filtering
	getAllCoupons = async (
		filter: WhereOptions<CouponAttributes> = {},
		limit: number,
		offset: number,
		order: Order,
	): Promise<Coupon[] | CouponAttributes[] | null> => {
		try {
			const coupons = await Coupon.findAll({
				where: filter,
				limit,
				offset,
				order,
			});
			if (coupons) {
				return coupons.map((coupon) => coupon.toJSON());
			}
			return null;
		} catch (err: any) {
			console.log("Error fetching coupons: ", err.message);
			throw err;
		}
	};
}

export default CouponService;
