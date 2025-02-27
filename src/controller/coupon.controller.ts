import { Request, Response, NextFunction } from "express";
import { createSlug, responseSender } from "@/util";
import { Op, Order, WhereOptions } from "sequelize";
import CouponService from "@/service/coupon.service";
import { CouponAttributes } from "@/model/coupon.model";

class CouponController {
	private couponService: CouponService;

	constructor() {
		this.couponService = new CouponService();
	}

	createCoupon = async (req: Request, res: Response, next: NextFunction) => {
		try {
			const newCoupon = {
				name: (req as any).validatedValue.name,
				code: (req as any).validatedValue.code,
				discountAmount: (req as any).validatedValue.discountAmount,
				minimumAmount: (req as any).validatedValue.minimumAmount,
				endDate: (req as any).validatedValue.endDate,
				categoryId: (req as any).validatedValue.categoryId,
			};

			const isCouponExist =
				await this.couponService.getActiveCouponByCode(newCoupon.code);

			if (isCouponExist) {
				return responseSender(
					res,
					400,
					"An active coupon is already exist associated with this code. Plese use another code to create.",
				);
			}

			const createdCoupon = await this.couponService.createCoupon(
				newCoupon.name,
				newCoupon.code,
				newCoupon.discountAmount,
				newCoupon.minimumAmount,
				newCoupon.endDate,
				newCoupon.categoryId,
			);

			if (!createdCoupon) {
				return responseSender(
					res,
					500,
					"Coupon creation failed. Please try again.",
				);
			}

			return responseSender(res, 201, "Coupon created successfully.", {
				category: createdCoupon,
			});
		} catch (err: any) {
			console.log(
				"Error occured while creating coupon: ".red,
				err.message,
			);
			next(err);
		}
	};

	editCoupon = async (req: Request, res: Response, next: NextFunction) => {
		try {
			const editedCoupon = {
				couponId: (req as any).validatedValue.couponId,
				name: (req as any).validatedValue.name,
				discountAmount: (req as any).validatedValue.discountAmount,
				minimumAmount: (req as any).validatedValue.minimumAmount,
				endDate: (req as any).validatedValue.endDate,
				isActive: (req as any).validatedValue.isActive,
				categoryId: (req as any).validatedValue.categoryId,
			};

			const fetchedCoupon = await this.couponService.getCouponById(
				editedCoupon.couponId,
			);

			if (fetchedCoupon && !(fetchedCoupon?.endDate >= new Date())) {
				return responseSender(
					res,
					400,
					"The coupon is already expired.",
				);
			}

			const isUpdated = await this.couponService.updateCoupon(
				editedCoupon.couponId,
				editedCoupon.name,
				editedCoupon.discountAmount,
				editedCoupon.minimumAmount,
				editedCoupon.endDate,
				editedCoupon.isActive,
				editedCoupon.categoryId,
			);

			if (!isUpdated) {
				return responseSender(
					res,
					500,
					"Coupon update failed. Please try again.",
				);
			}

			return responseSender(res, 200, "Coupon updated successfully.");
		} catch (err: any) {
			console.log(
				"Error occured while updating coupon: ".red,
				err.message,
			);
			next(err);
		}
	};

	deleteCoupon = async (req: Request, res: Response, next: NextFunction) => {
		try {
			const fetchedCoupon = await this.couponService.getCouponById(
				Number((req as any).validatedValue.couponId),
			);

			if (!fetchedCoupon) {
				return responseSender(res, 400, "Coupon couldn't found.");
			}

			const isDeleted = await this.couponService.deleteCoupon(
				fetchedCoupon.couponId,
			);
			if (!isDeleted) {
				return responseSender(
					res,
					500,
					"Couldn't delete coupon. Please try again.",
				);
			}

			return responseSender(res, 200, "Coupon deleted successfully.");
		} catch (err: any) {
			console.log(
				"Error occured while creating coupon: ".red,
				err.message,
			);
			next(err);
		}
	};

	getAllCoupons = async (req: Request, res: Response, next: NextFunction) => {
		try {
			const searchTerm = (req as any).validatedValue.searchTerm;
			const searchBy = (req as any).validatedValue.searchBy;
			const currentPage = parseInt((req as any).validatedValue.page || 1);
			const limitPerPage = parseInt(
				(req as any).validatedValue.limit || 20,
			);
			const offset = (currentPage - 1) * limitPerPage;
			const order: Order = [["createdAt", "DESC"]];
			const filter: WhereOptions<CouponAttributes> = {};

			if (searchTerm && searchBy) {
				switch (searchBy) {
					case "name":
						filter.name = {
							[Op.like]: `%${searchTerm}%`,
						};
						break;
					case "code":
						filter.code = {
							[Op.like]: `%${searchTerm}%`,
						};
						break;
					default:
						break;
				}
			}

			const coupons = await this.couponService.getAllCoupons(
				filter,
				limitPerPage,
				offset,
				order,
			);
			if (!coupons) {
				return responseSender(
					res,
					400,
					"Failed to get coupons. Please try again.",
				);
			}
			return responseSender(res, 200, "Coupons fetched successfully.", {
				coupons,
			});
		} catch (err: any) {
			console.log(
				"Error occured while fetching coupons: ".red,
				err.message,
			);
			next(err);
		}
	};
}

export default CouponController;
