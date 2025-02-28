import Joi from "joi";
import { responseSender } from "../util";
import { Request, Response, NextFunction } from "express";

class CouponMiddleware {
	private schema: {
		couponId: Joi.NumberSchema;
		name: Joi.StringSchema;
		code: Joi.StringSchema;
		discountAmount: Joi.NumberSchema;
		minimumAmount: Joi.NumberSchema;
		endDate: Joi.DateSchema;
		categoryId: Joi.NumberSchema;
	};
	constructor() {
		this.schema = {
			couponId: Joi.number().required().messages({
				"number.base": "couponId must be a number.",
				"number.empty": "couponId cannot be empty.",
				"number.required": "couponId is required.",
			}),
			name: Joi.string().trim().required().messages({
				"string.base": "name must be a string.",
				"string.empty": "name cannot be empty.",
				"any.required": "name is required.",
			}),
			code: Joi.string().trim().required().messages({
				"string.base": "code must be a string.",
				"string.empty": "code cannot be empty.",
				"any.required": "code is required.",
			}),
			discountAmount: Joi.number().required().messages({
				"number.base": "discountAmount must be a number.",
				"number.empty": "discountAmount cannot be empty.",
				"number.required": "discountAmount is required.",
			}),
			minimumAmount: Joi.number().required().messages({
				"number.base": "minimumAmount must be a number.",
				"number.empty": "minimumAmount cannot be empty.",
				"number.required": "minimumAmount is required.",
			}),
			categoryId: Joi.number().optional().messages({
				"number.base": "categoryId must be a number.",
				"number.empty": "categoryId cannot be empty.",
			}),
			endDate: Joi.date().required().messages({
				"number.base": "endDate must be a number.",
				"number.empty": "endDate cannot be empty.",
				"number.required": "endDate is required.",
			}),
		};
	}

	validateCouponCreation = (
		req: Request,
		res: Response,
		next: NextFunction,
	) => {
		try {
			const couponSchema = Joi.object({
				name: this.schema.name,
				code: this.schema.code,
				discountAmount: this.schema.discountAmount,
				minimumAmount: this.schema.minimumAmount,
				endDate: this.schema.endDate,
				categoryId: this.schema.categoryId,
			});

			const validationResult = couponSchema.validate(req.body);

			if (validationResult.error) {
				console.log(
					"Error occures while validating coupon creation: ".red,
					validationResult.error.message,
				);
				return responseSender(res, 400, validationResult.error.message);
			}

			// everything is fine
			(req as any).validatedValue = validationResult.value;
			next();
		} catch (err: any) {
			console.log(
				"Error occures while validating coupon creation: ".red,
				err.message,
			);
			next(err);
		}
	};

	validateCouponEdit = (req: Request, res: Response, next: NextFunction) => {
		try {
			const couponSchema = Joi.object({
				name: this.schema.name,
				discountAmount: this.schema.discountAmount,
				minimumAmount: this.schema.minimumAmount,
				endDate: this.schema.endDate,
				categoryId: this.schema.categoryId,
			});

			const validationResult = couponSchema.validate(req.body);

			if (validationResult.error) {
				console.log(
					"Error occures while validating coupon edit: ".red,
					validationResult.error.message,
				);
				return responseSender(res, 400, validationResult.error.message);
			}

			// everything is fine
			(req as any).validatedValue = validationResult.value;
			next();
		} catch (err: any) {
			console.log(
				"Error occures while validating coupon edit: ".red,
				err.message,
			);
			next(err);
		}
	};

	validateCouponDeletion = (
		req: Request,
		res: Response,
		next: NextFunction,
	) => {
		try {
			const couponSchema = Joi.object({
				couponId: this.schema.couponId,
			});

			const validationResult = couponSchema.validate(req.params);

			if (validationResult.error) {
				console.log(
					"Error occures while validating coupon deletion: ".red,
					validationResult.error.message,
				);
				return responseSender(res, 400, validationResult.error.message);
			}

			// everything is fine
			(req as any).validatedValue = validationResult.value;
			next();
		} catch (err: any) {
			console.log(
				"Error occures while validating coupon deletion: ".red,
				err.message,
			);
			next(err);
		}
	};

	validateFilteringQueries = (
		req: Request,
		res: Response,
		next: NextFunction,
	) => {
		try {
			const couponScema = Joi.object({
				searchTerm: Joi.string().trim().optional().messages({
					"string.base": "searchTerm must be a string.",
					"string.empty": "searchTerm cannot be empty.",
				}),
				page: Joi.number().optional().default(1).messages({
					"number.base": "page must be a integer.",
				}),
				limit: Joi.number().optional().default(20).messages({
					"number.base": "limit must be a integer.",
				}),
			});

			const validationResult = couponScema.validate(req.query);

			if (validationResult.error) {
				console.log(
					"Error occures while validating filtering queries: ".red,
					validationResult.error.message,
				);
				return responseSender(res, 400, validationResult.error.message);
			}

			// everything is fine
			(req as any).validatedValue = validationResult.value;
			next();
		} catch (err: any) {
			console.log(
				"Error occures while validating filtering queries: ".red,
				err.message,
			);
			next(err);
		}
	};
}

export default CouponMiddleware;
