import Joi from "joi";
import { Request, Response, NextFunction } from "express";
import { responseSender } from "@/util";

class AdminMiddleware {
	private schema: {
		name: Joi.StringSchema;
		email: Joi.StringSchema;
		password: Joi.StringSchema;
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
			password: Joi.string().trim().min(8).required().messages({
				"string.base": "Password must be a string.",
				"string.empty": "Password cannot be empty.",
				"string.min": "Password must be at least 8 characters long.",
				"any.required": "Password is required.",
			}),
		};
	}

	validateAdminRegistration = (
		req: Request,
		res: Response,
		next: NextFunction,
	): void => {
		try {
			const adminSchema = Joi.object(this.schema);

			const validationResult = adminSchema.validate(req.body);
			if (validationResult.error) {
				console.log(
					"Error occures while validating admin registration: ".red,
					validationResult.error.message,
				);
				return responseSender(res, 400, validationResult.error.message);
			}

			// everything is fine
			(req as any).validatedValue = validationResult.value;
			next();
		} catch (err: any) {
			console.log(
				"Error occures while validating admin registration: ".red,
				err.message,
			);
			next(err);
		}
	};

	validateAdminLogin = (req: Request, res: Response, next: NextFunction) => {
		try {
			const adminSchema = Joi.object({
				email: this.schema.email,
				password: this.schema.password,
			});

			const validationResult = adminSchema.validate(req.body);
			if (validationResult.error) {
				console.log(
					"Error occures while validating admin login: ".red,
					validationResult.error.message,
				);
				return responseSender(res, 400, validationResult.error.message);
			}

			// everything is fine
			(req as any).validatedValue = validationResult.value;
			next();
		} catch (err: any) {
			console.log(
				"Error occures while validating admin login: ".red,
				err.message,
			);
			next(err);
		}
	};

	validateAdminUpdate = (req: Request, res: Response, next: NextFunction) => {
		try {
			const adminSchema = Joi.object({
				name: this.schema.name,
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

			const validationResult = adminSchema.validate(req.body, {
				allowUnknown: true,
			});

			if (validationResult.error) {
				console.log(
					"Error occures while validating admin information update: "
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
				"Error occures while validating admin information update: ".red,
				err.message,
			);
			next(err);
		}
	};
}

export default AdminMiddleware;
