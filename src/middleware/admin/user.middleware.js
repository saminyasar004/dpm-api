const Joi = require("joi");
const { responseSender } = require("../../util");

const userMiddleware = {};

const schema = {
	name: Joi.string().trim().min(2).required().messages({
		"string.base": "Name must be a string",
		"string.empty": "Name is required",
		"string.min": "Name must be at least 2 characters long",
		"any.required": "Name is required",
	}),
	email: Joi.string().trim().email().required().messages({
		"string.base": "Email must be a string",
		"string.email": "Invalid email address",
		"string.empty": "Email is required",
		"any.required": "Email is required",
	}),
	password: Joi.string().trim().min(8).required().messages({
		"string.base": "Password must be a string",
		"string.empty": "Password is required",
		"string.min": "Password must be at least 8 characters long",
		"any.required": "Password is required",
	}),
	role: Joi.string().trim().valid("agent", "designer").required().messages({
		"string.base": "Role must be a string.",
		"string.empty": "Role is required",
		"any.required": "Role is required",
	}),
};

userMiddleware.validateUserRegistration = (req, res, next) => {
	try {
		const userSchema = Joi.object(schema);

		const { error } = userSchema.validate(req.body);
		if (error) {
			console.log(error.message);
			return responseSender(res, 400, error.message);
		}

		// everything is fine
		next();
	} catch (err) {
		console.log(
			"Error occures while validating user registration: ".red,
			err.message
		);
		next(err);
	}
};

userMiddleware.validateUserLogin = (req, res, next) => {
	try {
		const userSchema = Joi.object({
			email: schema.email,
			password: schema.password,
		});

		const { error } = userSchema.validate(req.body);
		if (error) {
			console.log(error.message);
			return responseSender(res, 400, error.message);
		}

		// everything is fine
		next();
	} catch (err) {
		console.log(
			"Error occures while validating user login: ".red,
			err.message
		);
		next(err);
	}
};

module.exports = userMiddleware;
