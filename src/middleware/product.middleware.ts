import Joi from "joi";
import { responseSender } from "../util";
import { Request, Response, NextFunction } from "express";

class ProductMiddleware {
	private schema: {
		name: Joi.StringSchema;
		sku: Joi.StringSchema;
		tags: Joi.ArraySchema;
		description: Joi.StringSchema;
		basePrice: Joi.NumberSchema;
		minOrderQuantity: Joi.NumberSchema;
		pricingType: Joi.StringSchema;
		isActive: Joi.BooleanSchema;
		categoryId: Joi.NumberSchema;
		attributes: Joi.ArraySchema;
		variationItems: Joi.ArraySchema;
		bulkDiscounts: Joi.ArraySchema;
	};
	private attributesSchema: Joi.ObjectSchema;
	private bulkDiscountsSchema: Joi.ObjectSchema;
	constructor() {
		this.attributesSchema = Joi.object({
			property: Joi.string().trim().min(3).required().messages({
				"string.base": "property must be a string.",
				"string.empty": "property cannot be empty.",
				"any.required": "property is required.",
				"string.min": "property must be atleast 3 characters long.",
			}),
			description: Joi.string().trim().min(3).required().messages({
				"string.base": "description must be a string.",
				"string.empty": "description cannot be empty.",
				"any.required": "description is required.",
				"string.min": "description must be atleast 3 characters long.",
			}),
		});

		this.bulkDiscountsSchema = Joi.object({
			minQuantity: Joi.number().required().messages({
				"number.base": "minQuantity must be a number.",
				"number.empty": "minQuantity cannot be empty.",
				"number.required": "minQuantity is required.",
			}),
			maxQuantity: Joi.number().required().messages({
				"number.base": "maxQuantity must be a number.",
				"number.empty": "maxQuantity cannot be empty.",
				"number.required": "maxQuantity is required.",
			}),
			discountPercentage: Joi.number().required().messages({
				"number.base": "discountPercentage must be a number.",
				"number.empty": "discountPercentage cannot be empty.",
				"number.required": "discountPercentage is required.",
			}),
		});

		this.schema = {
			name: Joi.string().trim().min(5).required().messages({
				"string.base": "name must be a string.",
				"string.empty": "name cannot be empty.",
				"any.required": "name is required.",
				"string.min": "name must be atleast 5 characters long.",
			}),
			sku: Joi.string().trim().required().messages({
				"string.base": "sku must be a string.",
				"string.empty": "sku cannot be empty.",
				"any.required": "sku is required.",
			}),
			description: Joi.string().trim().required().messages({
				"string.base": "description must be a string.",
				"string.empty": "description cannot be empty.",
				"any.required": "description is required.",
			}),
			tags: Joi.array().items(Joi.string()),
			basePrice: Joi.number().required().messages({
				"number.base": "basePrice must be a number.",
				"number.empty": "basePrice cannot be empty.",
				"any.required": "basePrice is required.",
			}),
			minOrderQuantity: Joi.number().required().messages({
				"number.base": "minOrderQuantity must be a number.",
				"number.empty": "minOrderQuantity cannot be empty.",
				"any.required": "minOrderQuantity is required.",
			}),
			pricingType: Joi.string()
				.trim()
				.valid("flat", "square-feet")
				.required()
				.messages({
					"string.base": "pricingType must be a string.",
					"string.empty": "pricingType cannot be empty.",
					"any.required": "pricingType is required.",
					"string.valid":
						"pricingType must be either 'flat' or 'square-feet'.",
				}),
			isActive: Joi.boolean().default(true).optional().messages({
				"number.base": "isActive must be a boolean.",
			}),
			categoryId: Joi.number().optional().allow(null).messages({
				"number.base": "categoryId must be a number.",
			}),
			attributes: Joi.array()
				.items(this.attributesSchema)
				.optional()
				.messages({
					"array.base": "attributes must be an array.",
				}),
			variationItems: Joi.array().items(Joi.number()),
			bulkDiscounts: Joi.array()
				.items(this.bulkDiscountsSchema)
				.optional()
				.messages({
					"array.base": "bulkDiscounts must be an array.",
				}),
		};
	}

	validateProductCreation = (
		req: Request,
		res: Response,
		next: NextFunction,
	) => {
		try {
			const productSchema = Joi.object(this.schema);

			const validationResult = productSchema.validate(req.body);

			if (validationResult.error) {
				console.log(
					"Error occures while validating product creation: ".red,
					validationResult.error.message,
				);
				return responseSender(res, 400, validationResult.error.message);
			}

			// everything is fine
			(req as any).validatedValue = validationResult.value;
			next();
		} catch (err: any) {
			console.log(
				"Error occures while validating product creation: ".red,
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
			const productSchema = Joi.object({
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

			const validationResult = productSchema.validate(req.query);

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

export default ProductMiddleware;
