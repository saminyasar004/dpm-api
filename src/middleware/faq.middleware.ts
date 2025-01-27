import Joi from "joi";
import { responseSender } from "@/util";
import { Request, Response, NextFunction } from "express";

class FaqMiddleware {
	private schema: {
		title: Joi.StringSchema;
		faqItems: Joi.ArraySchema;
	};
	private faqItemsSchema: Joi.ObjectSchema;
	constructor() {
		this.faqItemsSchema = Joi.object({
			question: Joi.string().required().messages({
				"string.base": "Question must be a string.",
				"string.empty": "Question cannot be empty.",
				"any.required": "Question is required.",
			}),
			answer: Joi.string().required().messages({
				"string.base": "Answer must be a string.",
				"string.empty": "Answer cannot be empty.",
				"any.required": "Answer is required.",
			}),
		});

		this.schema = {
			title: Joi.string().trim().min(5).required().messages({
				"string.base": "Title must be a string.",
				"string.empty": "Title cannot be empty.",
				"string.min": "Title must be at least 5 characters long.",
				"any.required": "Title is required.",
			}),
			faqItems: Joi.array()
				.items(this.faqItemsSchema)
				.required()
				.min(1)
				.messages({
					"array.base": "faqItems must be an array.",
					"array.empty": "faqItems cannot be empty.",
					"array.min": "At least one faqItem is required.",
				}),
		};
	}

	validateFaqCreation = (req: Request, res: Response, next: NextFunction) => {
		try {
			const faqSchema = Joi.object(this.schema);

			const validationResult = faqSchema.validate(req.body, {
				abortEarly: false,
			});

			if (validationResult.error) {
				const errors = validationResult.error.details.map((detail) => ({
					field: detail.path.join("."),
					message: detail.message,
				}));

				console.log(errors);

				console.log(
					"Error occures while validating faq: ".red,
					errors[0].message,
				);
				return responseSender(res, 400, errors[0].message);
			}

			// everything is fine
			(req as any).validatedValue = validationResult.value;
			next();
		} catch (err: any) {
			console.log(
				"Error occures while validating the faq: ".red,
				err.message,
			);
			next(err);
		}
	};
}

export default FaqMiddleware;
