import Joi from "joi";
import { responseSender } from "@/util";
import { Request, Response, NextFunction } from "express";

class ProductVariationMiddleware {
	private schema: {
		name: Joi.StringSchema;
		unit: Joi.StringSchema;
		variationItems: Joi.ArraySchema;
	};
	private variationItemSchema: {
		variationItemId?: Joi.NumberSchema;
		variationId?: Joi.NumberSchema;
		value: Joi.StringSchema;
		additionalPrice: Joi.NumberSchema;
	};
	constructor() {
		this.variationItemSchema = {
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

		this.schema = {
			name: Joi.string().trim().min(2).required().messages({
				"string.base": "name must be a string.",
				"string.empty": "name cannot be empty.",
				"string.min": "name must be at least 2 characters long.",
				"any.required": "name is required.",
			}),
			unit: Joi.string().trim().optional().allow("").messages({
				"string.base": "unit must be a string.",
			}),
			variationItems: Joi.array()
				.items(Joi.object(this.variationItemSchema))
				.required()
				.min(1)
				.messages({
					"array.base": "variationItems must be an array.",
					"array.empty": "variationItems cannot be empty.",
					"array.min": "At least one variationItem is required.",
				}),
		};
	}

	validateProductVariationCreation = (
		req: Request,
		res: Response,
		next: NextFunction,
	) => {
		try {
			const productVariationSchema = Joi.object(this.schema);

			const validationResult = productVariationSchema.validate(req.body, {
				abortEarly: false,
			});

			if (validationResult.error) {
				const errors = validationResult.error.details.map((detail) => ({
					field: detail.path.join("."),
					message: detail.message,
				}));

				console.log(
					"Error occures while validating product variation: ".red,
					errors[0].message,
				);
				return responseSender(res, 400, errors[0].message);
			}

			// everything is fine
			(req as any).validatedValue = validationResult.value;
			next();
		} catch (err: any) {
			console.log(
				"Error occures while validating the product variation: ".red,
				err.message,
			);
			next(err);
		}
	};

	validateProductVariationEdit = (
		req: Request,
		res: Response,
		next: NextFunction,
	) => {
		try {
			const productVariationSchema = Joi.object({
				...this.schema,
				variationId: Joi.number().required().messages({
					"number.base": "variationId must be a number.",
					"any.required": "variationId is required for updating.",
				}),
			});

			const validationResult = productVariationSchema.validate(req.body);

			if (validationResult.error) {
				console.log(
					"Error occures while validating product variation edit: "
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
				"Error occures while validating product variation edit: ".red,
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
			const productVariationSchema = Joi.object({
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

			const validationResult = productVariationSchema.validate(req.query);

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

export default ProductVariationMiddleware;
