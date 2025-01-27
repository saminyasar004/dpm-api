import Joi from "joi";
import { responseSender } from "@/util";
import { Request, Response, NextFunction } from "express";
import path from "path";
import fs from "fs";

class InqueryMiddleware {
	private schema: {
		name: Joi.StringSchema;
		email: Joi.StringSchema;
		phone: Joi.StringSchema;
		company: Joi.StringSchema;
		inqueryType: Joi.StringSchema<
			| "product-information"
			| "pricing"
			| "customization-options"
			| "others"
		>;
		message: Joi.StringSchema;
	};
	constructor() {
		this.schema = {
			name: Joi.string().trim().min(2).required().messages({
				"string.base": "Name must be a string.",
				"string.empty": "Name cannot be empty.",
				"string.min": "Name must be at least 2 characters long.",
				"any.required": "Name is required.",
			}),
			email: Joi.string().trim().email().required().messages({
				"string.base": "Email must be a string.",
				"string.email": "Invalid email address.",
				"string.empty": "Email cannot be empty.",
				"any.required": "Email is required.",
			}),
			phone: Joi.string()
				.trim()
				.required()
				.pattern(/^01[3-9][0-9]{8}$/)
				.messages({
					"string.pattern.base":
						"Phone number must be a valid Bangladeshi number starting with 01 and 11 digits long.",
					"string.empty": "Phone number cannot be empty.",
					"any.required": "Phone number is required.",
				}),
			company: Joi.string()
				.trim()
				.allow("")
				.optional()
				.default("")
				.min(3)
				.messages({
					"string.base": "Company name must be a string.",
					"string.min":
						"Company name must be at least 3 characters long.",
				}),
			inqueryType: Joi.string()
				.trim()
				.required()
				.valid(
					"product-information",
					"pricing",
					"customization-options",
					"others",
				)
				.messages({
					"string.base": "Inquery type must be a string.",
					"any.required":
						"Inquery type is required. It should be one of 'product-information', 'pricing', 'customization-options', 'others'",
				}) as Joi.StringSchema<
				| "product-information"
				| "pricing"
				| "customization-options"
				| "others"
			>,
			message: Joi.string().trim().min(5).required().messages({
				"string.base": "Message must be a string.",
				"string.min": "Message must be at least 5 characters long.",
				"any.required": "Message is required.",
			}),
		};
	}

	validateInqueryCreation = (
		req: Request,
		res: Response,
		next: NextFunction,
	) => {
		try {
			const inquerySchema = Joi.object(this.schema);

			const validationResult = inquerySchema.validate(req.body);
			if (validationResult.error) {
				if (req.file) {
					const filePath = path.join(
						req.file.destination,
						req.file.filename,
					);

					fs.unlink(filePath, (unlinkErr) => {
						if (unlinkErr)
							console.log(
								"Error deleting uploaded file: ".red,
								unlinkErr.message,
							);
					});
				}

				console.log(
					"Error occures while validating inquery creation: ".red,
					validationResult.error.message,
				);
				return responseSender(res, 400, validationResult.error.message);
			}

			// everything is fine
			(req as any).validatedValue = validationResult.value;
			next();
		} catch (err: any) {
			if (req.file) {
				const filePath = path.join(
					req.file.destination,
					req.file.filename,
				);

				fs.unlink(filePath, (unlinkErr) => {
					if (unlinkErr)
						console.log(
							"Error deleting uploaded file: ".red,
							unlinkErr.message,
						);
				});
			}

			console.log(
				"Error occures while validating inquery creation: ".red,
				err.message,
			);
			next(err);
		}
	};

	validateInqueryClose = (
		req: Request,
		res: Response,
		next: NextFunction,
	) => {
		try {
			const inquerySchema = Joi.object({
				inqueryId: Joi.number().required().messages({
					"number.base": "inqueryId must be a integer.",
					"number.required": "inqueryId is required.",
				}),
			});

			const validationResult = inquerySchema.validate(req.query);
			if (validationResult.error) {
				console.log(
					"Error occures while validating inquery closing: ".red,
					validationResult.error.message,
				);
				return responseSender(res, 400, validationResult.error.message);
			}

			// everything is fine
			(req as any).validatedValue = validationResult.value;
			next();
		} catch (err: any) {
			console.log(
				"Error occures while validating inquery closing: ".red,
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
			const inqueryFilteringSchema = Joi.object({
				searchTerm: Joi.string().trim().optional().messages({
					"string.base": "search term must be a string.",
					"string.empty": "search term cannot be empty.",
				}),
				searchBy: Joi.string()
					.trim()
					.optional()
					.valid("name", "email")
					.messages({
						"string.base": "search by must be a string.",
						"any.valid": "search by should be 'name' or 'email'.",
						"string.empty": "search by cannot be empty.",
					}),
				inqueryType: Joi.string()
					.trim()
					.optional()
					.valid(
						"product-information",
						"pricing",
						"customization-options",
						"others",
					)
					.messages({
						"string.base": "inquery type must be a string.",
						"string.empty": "inquery type cannot be empty.",
						"any.valid":
							"inquery type should be one of 'product-information', 'pricing', 'customization-options', 'others'",
					}),
				status: Joi.string()
					.trim()
					.optional()
					.valid("open", "closed")
					.messages({
						"string.base": "status must be a string.",
						"any.valid": "status should be 'open' or 'closed'.",
						"string.empty": "status cannot be empty.",
					}),
				page: Joi.number().optional().default(1).messages({
					"number.base": "page must be a integer.",
				}),
				limit: Joi.number().optional().default(20).messages({
					"number.base": "limit must be a integer.",
				}),
			});

			const validationResult = inqueryFilteringSchema.validate(req.query);
			if (validationResult.error) {
				console.log(
					"Error occures while validating inquery filter queries: "
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
				"Error occures while validating inquery filter queries: ".red,
				err.message,
			);
			next(err);
		}
	};
}

export default InqueryMiddleware;
