import Faq, { FaqAttributes } from "@/model/faq.model";
import FaqItem, { FaqItemAttributes } from "@/model/faq-item.model";

class FaqService {
	addNewFaq = async (title: string): Promise<Faq | FaqAttributes | null> => {
		try {
			const faq = await Faq.create({
				faqTitle: title,
			});
			const createdFaq = await Faq.findByPk(faq.faqId);
			if (createdFaq) {
				return createdFaq.toJSON();
			}
			return null;
		} catch (err: any) {
			console.log(
				"Error occurred while creating new faq: ".red,
				err.message,
			);
			throw err;
		}
	};

	addNewFaqItem = async (
		faqId: number,
		question: string,
		answer: string,
	): Promise<FaqItem | FaqItemAttributes | null> => {
		try {
			const faqItem = await FaqItem.create({
				faqId,
				question,
				answer,
			});
			const createdFaqItem = await FaqItem.findByPk(faqItem.faqItemId);
			if (createdFaqItem) {
				return createdFaqItem.toJSON();
			}
			return null;
		} catch (err: any) {
			console.log(
				"Error occurred while creating new faq question: ".red,
				err.message,
			);
			throw err;
		}
	};

	getAllFaq = async (): Promise<Faq[] | FaqAttributes[] | null> => {
		try {
			const faqs = await Faq.findAll();
			if (faqs) {
				return faqs.map((faq) => faq.toJSON());
			}
			return null;
		} catch (err: any) {
			console.log(
				"Error occurred while getting all faqs: ".red,
				err.message,
			);
			throw err;
		}
	};

	getAllFaqItems = async (
		faqId: number,
	): Promise<FaqItem[] | FaqItemAttributes[] | null> => {
		try {
			const faqItems = await FaqItem.findAll({
				where: {
					faqId,
				},
			});
			if (faqItems) {
				return faqItems.map((faqItem) => faqItem.toJSON());
			}
			return null;
		} catch (err: any) {
			console.log(
				"Error occurred while getting all faq items: ".red,
				err.message,
			);
			throw err;
		}
	};
}

export default FaqService;
