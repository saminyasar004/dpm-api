const joi = require("joi");
const { responseSender } = require("../../util");
const newsletterMiddleware = {};

const schema = {
	email: joi.string().trim().email().required().messages({
		"string.base": "Email must be a string",
		"string.email": "Invalid email address",
		"string.empty": "Email is required",
		"any.required": "Email is required",
	}),
	token: joi.string().trim().required().messages({
		"string.base": "Token must be a string",
		"string.empty": "Token is required",
		"any.required": "Token is required",
	}),
};

newsletterMiddleware.validateEmailFromBody = (req, res, next) => {
	try {
		const { error } = joi
			.object({ email: schema.email })
			.validate(req.body);
		if (error) {
			console.log(error.message);
			return responseSender(res, 400, error.message);
		}

		// everything is fine
		next();
	} catch (err) {
		console.log("Error occures while validating email: ".red, err.message);
		next(err);
	}
};

newsletterMiddleware.validateEmailFromQuery = (req, res, next) => {
	try {
		const { error } = joi.object({ ...schema }).validate(req.query);
		if (error) {
			console.log(error.message);
			return responseSender(res, 400, error.message);
		}

		// everything is fine
		next();
	} catch (err) {
		console.log("Error occures while validating email: ".red, err.message);
		next(err);
	}
};

module.exports = newsletterMiddleware;
