import Faq, { FaqAttributes } from "@/model/faq.model";
import FaqItem, { FaqItemAttributes } from "@/model/faq-item.model";
import { Order, WhereOptions } from "sequelize";

class FaqService {
	createNewFaq = async (
		faqTitle: string,
	): Promise<Faq | FaqAttributes | null> => {
		try {
			const faq = await Faq.create({
				faqTitle,
			});

			return faq ? faq.toJSON() : null;
		} catch (err: any) {
			console.log(
				"Error occurred while creating new faq: ".red,
				err.message,
			);
			throw err;
		}
	};

	createNewFaqItem = async (
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

			return createdFaqItem ? createdFaqItem.toJSON() : null;
		} catch (err: any) {
			console.log(
				"Error occurred while creating new faq question: ".red,
				err.message,
			);
			throw err;
		}
	};

	// Remove a faq item
	removeFaqItem = async (faqItemId: number): Promise<boolean> => {
		try {
			const item = await Faq.findByPk(faqItemId);
			if (item) {
				await item.destroy();
				return true;
			}
			return false;
		} catch (err: any) {
			console.error("Error while deleting faq item: ", err.message);
			throw err;
		}
	};

	// Update faq details
	updateFaq = async (
		faqId: number,
		faqTitle: string,
		faqItems: {
			faqItemId?: number;
			faqId?: number;
			question: string;
			answer: string;
		}[],
	): Promise<boolean> => {
		try {
			// Update faq
			const [updatedRows] = await Faq.update(
				{ faqTitle },
				{ where: { faqId } },
			);

			if (!updatedRows) {
				return false;
			}

			// Update or create faq items
			for (const item of faqItems) {
				if (item.faqItemId) {
					// Update existing faq item
					await FaqItem.update(
						{
							question: item.question,
							answer: item.answer,
						},
						{
							where: {
								faqItemId: item.faqItemId,
								faqId,
							},
						},
					);
				} else {
					// Create new faq item
					await FaqItem.create({
						question: item.question,
						answer: item.question,
						faqId,
					});
				}
			}

			// clean up the table removing unnecassary item
			const faqItemsInDb = await this.getAllFaqItems(faqId);

			if (faqItemsInDb) {
				for (const item of faqItemsInDb) {
					if (
						!faqItems.some(
							(faqItem) => faqItem.question === item.question,
						)
					) {
						// delete the item
						await this.deleteFaqItemById(item.faqItemId);
					}
				}
			}

			return true;
		} catch (err: any) {
			console.error("Error while updating faq: ", err.message);
			throw err;
		}
	};

	// Delete a faq (also deletes related items)
	deleteFaq = async (faqId: number): Promise<boolean> => {
		try {
			const faq = await Faq.findByPk(faqId);
			if (faq) {
				await faq.destroy();
				return true;
			}
			return false;
		} catch (err: any) {
			console.error("Error while deleting faq: ", err.message);
			throw err;
		}
	};

	deleteFaqItemById = async (faqItemId: number): Promise<boolean> => {
		try {
			const faqItem = await FaqItem.findByPk(faqItemId);
			if (faqItem) {
				await faqItem.destroy();
				return true;
			}
			return false;
		} catch (err: any) {
			console.error("Error while deleting faqItem: ", err.message);
			throw err;
		}
	};

	getFaqById = async (faqId: number): Promise<Faq | FaqAttributes | null> => {
		try {
			const faq = await Faq.findByPk(faqId, {
				include: [{ model: FaqItem, as: "faqItems" }],
			});
			return faq ? faq.toJSON() : null;
		} catch (err: any) {
			console.log(
				"Error occurred while fetching faq by id: ".red,
				err.message,
			);
			throw err;
		}
	};

	getAllFaq = async (
		filter: WhereOptions<FaqAttributes> = {},
		limit: number,
		offset: number,
		order?: Order,
	): Promise<Faq[] | FaqAttributes[] | null> => {
		try {
			const faqs = await Faq.findAll({
				where: filter,
				limit,
				offset,
				order,
				include: [
					{
						model: FaqItem,
						as: "faqItems",
					},
				],
			});
			if (faqs) {
				return faqs.map((faq) => faq.toJSON());
			}
			return null;
		} catch (err: any) {
			console.log(
				"Error occurred while fetching all faqs: ".red,
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
				"Error occurred while fetching all faq items: ".red,
				err.message,
			);
			throw err;
		}
	};
}

export default FaqService;
