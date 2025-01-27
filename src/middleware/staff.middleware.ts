import Joi from "joi";
import { Request, Response, NextFunction } from "express";
import { responseSender } from "@/util";

class StaffMiddleware {
	private schema: {
		name: Joi.StringSchema;
		email: Joi.StringSchema;
		password: Joi.StringSchema;
		role: Joi.StringSchema;
		commissionPercentage: Joi.NumberSchema;
	};

	constructor() {
		this.schema = {
			name: Joi.string().trim().min(2).required().messages({
				"string.base": "Name must be a string.",
				"string.empty": "Name is required.",
				"string.min": "Name must be at least 2 characters long.",
				"any.required": "Name is required.",
			}),
			email: Joi.string().trim().email().required().messages({
				"string.base": "Email must be a string.",
				"string.email": "Invalid email address.",
				"string.empty": "Email is required.",
				"any.required": "Email is required.",
			}),
			password: Joi.string().trim().min(8).required().messages({
				"string.base": "Password must be a string.",
				"string.empty": "Password is required.",
				"string.min": "Password must be at least 8 characters long.",
				"any.required": "Password is required.",
			}),
			role: Joi.string()
				.trim()
				.required()
				.valid("agent", "designer")
				.messages({
					"string.base": "Role must be a string.",
					"string.empty": "Role is required.",
					"string.valid":
						"Invalid role. Role must be 'agent' or 'designer'.",
					"any.required": "Role is required.",
				}),
			commissionPercentage: Joi.number().optional().default(1).messages({
				"number.base": "Commission percentage must be a number.",
				"number.empty": "Commission percentage cannot be empty.",
			}),
		};
	}

	validateStaffRegistration = (
		req: Request,
		res: Response,
		next: NextFunction,
	) => {
		try {
			const staffSchema = Joi.object(this.schema);

			const validationResult = staffSchema.validate(req.body);

			if (validationResult.error) {
				console.log(
					"Error occures while validating staff registration: ".red,
					validationResult.error.message,
				);
				return responseSender(res, 400, validationResult.error.message);
			}

			// everything is fine
			(req as any).validatedValue = validationResult.value;
			next();
		} catch (err: any) {
			console.log(
				"Error occures while validating staff registration: ".red,
				err.message,
			);
			next(err);
		}
	};

	validateStaffLogin = (req: Request, res: Response, next: NextFunction) => {
		try {
			const staffSchema = Joi.object({
				email: this.schema.email,
				password: this.schema.password,
			});

			const validationResult = staffSchema.validate(req.body);

			if (validationResult.error) {
				console.log(
					"Error occures while validating staff login: ".red,
					validationResult.error.message,
				);
				return responseSender(res, 400, validationResult.error.message);
			}

			// everything is fine
			(req as any).validatedValue = validationResult.value;
			next();
		} catch (err: any) {
			console.log(
				"Error occures while validating staff login: ".red,
				err.message,
			);
			next(err);
		}
	};

	validateStaffUpdate = (req: Request, res: Response, next: NextFunction) => {
		try {
			const staffSchema = Joi.object({
				name: this.schema.name,
				role: this.schema.role,
				commissionPercentage: this.schema.commissionPercentage,
				currentPassword: this.schema.password.messages({
					"string.base": "Current password must be a string.",
					"any.required": "Current password is required.",
					"string.empty": "Current password cannot be empty.",
				}),
				newPassword: this.schema.password.messages({
					"string.base": "New password must be a string.",
					"any.required": "New password is required.",
					"string.empty": "New password cannot be empty.",
				}),
			});

			const validationResult = staffSchema.validate(req.body);

			if (validationResult.error) {
				console.log(
					"Error occures while validating staff information update: "
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
				"Error occures while validating staff information update: ".red,
				err.message,
			);
			next(err);
		}
	};
}

export default StaffMiddleware;
