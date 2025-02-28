import Joi from "joi";
import { responseSender } from "../util";
import { Request, Response, NextFunction } from "express";

class OrderMiddleware {
	private schema: {
		customerId: Joi.NumberSchema;
		staffId: Joi.NumberSchema;
		statusId: Joi.NumberSchema;
		deliveryMethod: Joi.StringSchema;
		billingAddress: Joi.StringSchema;
		billingAddressCity: Joi.StringSchema;
		billingAddressPostCode: Joi.StringSchema;
		deliveryDate: Joi.DateSchema;
		orderItems: Joi.ArraySchema;
		payments: Joi.ArraySchema;
	};

	private orderItemVariationSchema: {
		name: Joi.StringSchema;
		unit: Joi.StringSchema;
		orderItemVariationItems: Joi.ArraySchema;
	};
	private orderItemVariationItemSchema: {
		variationItemId?: Joi.NumberSchema;
		variationId?: Joi.NumberSchema;
		value: Joi.StringSchema;
		additionalPrice: Joi.NumberSchema;
	};

	private orderItemsSchema: Joi.ObjectSchema;
	private paymentsSchema: Joi.ObjectSchema;

	private statusName: Joi.StringSchema;
	private orderStatusId: Joi.NumberSchema;
	constructor() {
		this.statusName = Joi.string().required().messages({
			"string.base": "statusName must be a string.",
			"string.empty": "statusName cannot be empty.",
			"any.required": "statusName is required.",
		});

		this.orderStatusId = Joi.number().required().messages({
			"number.base": "orderStatusId must be a number.",
			"number.empty": "orderStatusId cannot be empty.",
			"any.required": "orderStatusId is required.",
		});

		this.orderItemVariationItemSchema = {
			variationItemId: Joi.number().optional().messages({
				"number.base": "variationItemId must be a number.",
			}),
			variationId: Joi.number().optional().messages({
				"number.base": "variationId must be a number.",
			}),
			value: Joi.string().required().messages({
				"string.base": "value must be a string.",
				"string.empty": "value cannot be empty.",
				"any.required": "value is required.",
			}),
			additionalPrice: Joi.number().required().messages({
				"number.base": "additionalPrice must be a number.",
				"number.empty": "additionalPrice cannot be empty.",
				"any.required": "additionalPrice is required.",
			}),
		};

		this.orderItemVariationSchema = {
			name: Joi.string().trim().min(2).required().messages({
				"string.base": "name must be a string.",
				"string.empty": "name cannot be empty.",
				"string.min": "name must be at least 2 characters long.",
				"any.required": "name is required.",
			}),
			unit: Joi.string().trim().optional().allow("").messages({
				"string.base": "unit must be a string.",
			}),
			orderItemVariationItems: Joi.array()
				.items(Joi.object(this.orderItemVariationItemSchema))
				.required()
				.min(1)
				.messages({
					"array.base": "orderItemVariationItems must be an array.",
					"array.empty": "orderItemVariationItems cannot be empty.",
					"array.min": "At least one variationItem is required.",
				}),
		};

		this.orderItemsSchema = Joi.object({
			productId: Joi.number().required().messages({
				"number.base": "productId must be a number.",
				"number.empty": "productId cannot be empty.",
				"any.required": "productId is required.",
			}),

			variationItems: Joi.array()
				.required()
				.min(1)
				.items(Joi.object(this.orderItemVariationSchema))
				.messages({
					"array.min": "atleast one order item is required.",
				}),

			quantity: Joi.number().required().messages({
				"number.base": "quantity must be a number.",
				"number.empty": "quantity cannot be empty.",
				"any.required": "quantity is required.",
			}),

			price: Joi.number().required().messages({
				"number.base": "price must be a number.",
				"number.empty": "price cannot be empty.",
				"any.required": "price is required.",
			}),
		});

		this.paymentsSchema = Joi.object({
			paymentMethod: Joi.string().required().messages({
				"string.base": "paymentMethod must be a string.",
				"string.empty": "paymentMethod cannot be empty.",
				"any.required": "paymentMethod is required.",
			}),

			amount: Joi.number().required().messages({
				"number.base": "amount must be a number.",
				"number.empty": "amount cannot be empty.",
				"any.required": "amount is required.",
			}),
		});

		this.schema = {
			customerId: Joi.number().required().messages({
				"number.base": "customerId must be a number.",
				"number.empty": "customerId cannot be empty.",
				"any.required": "customerId is required.",
			}),

			staffId: Joi.number().required().messages({
				"number.base": "staffId must be a number.",
				"number.empty": "staffId cannot be empty.",
				"any.required": "staffId is required.",
			}),

			statusId: Joi.number().required().messages({
				"number.base": "statusId must be a number.",
				"number.empty": "statusId cannot be empty.",
				"any.required": "statusId is required.",
			}),
			billingAddress: Joi.string().required().messages({
				"string.base": "billingAddress must be a string.",
				"string.empty": "billingAddress cannot be empty.",
				"any.required": "billingAddress is required.",
			}),

			billingAddressCity: Joi.string().required().messages({
				"string.base": "billingAddressCity must be a string.",
				"string.empty": "billingAddressCity cannot be empty.",
				"any.required": "billingAddressCity is required.",
			}),
			billingAddressPostCode: Joi.string().required().messages({
				"string.base": "billingAddressPostCode must be a string.",
				"string.empty": "billingAddressPostCode cannot be empty.",
				"any.required": "billingAddressPostCode is required.",
			}),
			deliveryDate: Joi.date().iso().required().messages({
				"date.base": "deliveryDate must be a valid date.",
				"date.format":
					"deliveryDate must be in ISO 8601 format (YYYY-MM-DD).",
				"any.required": "deliveryDate is required.",
			}),

			deliveryMethod: Joi.string()
				.trim()
				.required()
				.valid("shop-pickup", "courier")
				.messages({
					"string.base": "deliveryMethod must be a string.",
					"string.empty": "deliveryMethod is required.",
					"string.valid":
						"invalid deliveryMethod. deliveryMethod must be 'shop-pickup' or 'courier'.",
					"any.required": "deliveryMethod is required.",
				}),

			orderItems: Joi.array()
				.items(this.orderItemsSchema)
				.required()
				.min(1)
				.messages({
					"array.min": "atleast one order item is required.",
				}),

			payments: Joi.array()
				.items(this.paymentsSchema)
				.required()
				.min(1)
				.messages({
					"array.min": "atleast one payment is required.",
				}),
		};
	}

	validateOrderStatusCreation = (
		req: Request,
		res: Response,
		next: NextFunction,
	) => {
		try {
			const orderStatusSchema = Joi.object(this.statusName);

			const validationResult = orderStatusSchema.validate(req.body);

			if (validationResult.error) {
				console.log(
					"Error occures while validating order status creation: "
						.red,
					validationResult.error.message,
				);
				return responseSender(res, 400, validationResult.error.message);
			}

			// everything is fine
			(req as any).validatedValue = validationResult.value;
			next();
		} catch (err: any) {
			console.log(
				"Error occures while validating order status creation: ".red,
				err.message,
			);
			next(err);
		}
	};

	validateOrderStatusEdit = (
		req: Request,
		res: Response,
		next: NextFunction,
	) => {
		try {
			const orderStatusSchema = Joi.object({
				statusName: this.statusName,
				orderStatusId: this.orderStatusId,
			});

			const validationResult = orderStatusSchema.validate(req.body);

			if (validationResult.error) {
				console.log(
					"Error occures while validating order status creation: "
						.red,
					validationResult.error.message,
				);
				return responseSender(res, 400, validationResult.error.message);
			}

			// everything is fine
			(req as any).validatedValue = validationResult.value;
			next();
		} catch (err: any) {
			console.log(
				"Error occures while validating order status creation: ".red,
				err.message,
			);
			next(err);
		}
	};

	validateOrderCreation = (
		req: Request,
		res: Response,
		next: NextFunction,
	) => {
		try {
			const orderSchema = Joi.object(this.schema);

			const validationResult = orderSchema.validate(req.body);

			if (validationResult.error) {
				console.log(
					"Error occures while validating order creation: ".red,
					validationResult.error.message,
				);
				return responseSender(res, 400, validationResult.error.message);
			}

			// everything is fine
			(req as any).validatedValue = validationResult.value;
			next();
		} catch (err: any) {
			console.log(
				"Error occures while validating order creation: ".red,
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
			const orderSchema = Joi.object({
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

			const validationResult = orderSchema.validate(req.query);

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

export default OrderMiddleware;
