import { FaqItemAttributes } from "@/model/faq-item.model";
import FaqService from "@/service/faq.service";
import { responseSender } from "@/util";
import { Request, Response, NextFunction } from "express";
import { title } from "process";

class FaqController {
	private faqService: FaqService;

	constructor() {
		this.faqService = new FaqService();
	}

	addNewFaq = async (req: Request, res: Response, next: NextFunction) => {
		try {
			const createdFaq = await this.faqService.addNewFaq(
				(req as any).validatedValue.title,
			);

			if (!createdFaq) {
				return responseSender(
					res,
					500,
					"Something went wrong. Please try again.",
				);
			}

			try {
				for (const faqItem of (req as any).validatedValue.faqItems) {
					await this.faqService.addNewFaqItem(
						createdFaq.faqId,
						faqItem.question,
						faqItem.answer,
					);
				}

				const newFaq = {
					...createdFaq,
					faqItems: await this.faqService.getAllFaqItems(
						createdFaq.faqId,
					),
				};

				return responseSender(res, 200, "Faq added successfully.", {
					faq: newFaq,
				});
			} catch (err: any) {
				console.log(
					"Error occures while adding new faq in controller: ".red,
					err.message,
				);
				next(err);
			}
		} catch (err: any) {
			console.log(
				"Error occures while adding new faq in controller: ".red,
				err.message,
			);
			next(err);
		}
	};

	getAllFaq = async (req: Request, res: Response, next: NextFunction) => {
		try {
			const faqs = (await this.faqService.getAllFaq()) || [];

			if (!faqs) {
				return responseSender(
					res,
					400,
					"Cannot find faqs. Please try again.",
				);
			}

			for (const faq of faqs) {
				faq.faqItems =
					(await this.faqService.getAllFaqItems(faq.faqId)) || [];
			}

			return responseSender(res, 200, "Faq fetched successfully.", {
				faqs,
			});
		} catch (err: any) {
			console.log(
				"Error occures while getting all faq in controller: ".red,
				err.message,
			);
			next(err);
		}
	};
}

export default FaqController;
