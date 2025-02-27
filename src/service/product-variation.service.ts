import Variation, {
	VariationAttributes,
	VariationCreationAttributes,
} from "@/model/variation.model";
import VariationItem, {
	VariationItemAttributes,
} from "@/model/variation-item.model";
import { Order, WhereOptions } from "sequelize";

class ProductVariationService {
	// Create a new variation with optional items
	createVariation = async (
		name: string,
		unit: string,
	): Promise<Variation | VariationAttributes | null> => {
		try {
			const variation = await Variation.create({ name, unit });

			return variation ? variation.toJSON() : null;
		} catch (err: any) {
			console.error("Error while creating variation: ", err.message);
			throw err;
		}
	};

	// Get a variation by ID with items
	getVariationById = async (
		variationId: number,
	): Promise<Variation | VariationAttributes | null> => {
		try {
			const variation = await Variation.findByPk(variationId, {
				include: [{ model: VariationItem, as: "variationItems" }],
			});
			return variation ? variation.toJSON() : null;
		} catch (err: any) {
			console.error("Error while fetching variation:", err.message);
			throw err;
		}
	};

	// Update variation details
	updateVariation = async (
		variationId: number,
		name: string,
		unit: string,
		variationItems: {
			variationItemId?: number;
			variationId?: number;
			value: string;
			additionalPrice: number;
		}[],
	): Promise<boolean> => {
		try {
			// Update ProductVariation
			const [updatedRows] = await Variation.update(
				{ name, unit },
				{ where: { variationId } },
			);

			if (!updatedRows) {
				return false;
			}

			// Update or create variation items
			for (const item of variationItems) {
				if (item.variationItemId) {
					// Update existing variation item
					await VariationItem.update(
						{
							value: item.value,
							additionalPrice: item.additionalPrice,
						},
						{
							where: {
								variationItemId: item.variationItemId,
								variationId,
							},
						},
					);
				} else {
					// Create new variation item
					await VariationItem.create({
						value: item.value,
						additionalPrice: item.additionalPrice,
						variationId,
					});
				}
			}

			// clean up the table removing unnecassary item
			const variationItemsInDb =
				await this.getAllVariationItems(variationId);

			if (variationItemsInDb) {
				for (const item of variationItemsInDb) {
					if (
						!variationItems.some(
							(variationItem) =>
								variationItem.value === item.value,
						)
					) {
						// delete the item
						await this.deleteVariationItemById(
							item.variationItemId,
						);
					}
				}
			}

			return true;
		} catch (err: any) {
			console.error("Error while updating variation: ", err.message);
			throw err;
		}
	};

	// Delete a variation (also deletes related items)
	deleteVariation = async (variationId: number): Promise<boolean> => {
		try {
			const variation = await Variation.findByPk(variationId);
			if (variation) {
				await variation.destroy();
				return true;
			}
			return false;
		} catch (err: any) {
			console.error("Error while deleting variation: ", err.message);
			throw err;
		}
	};

	deleteVariationItemById = async (
		variationItemId: number,
	): Promise<boolean> => {
		try {
			const variationItem = await VariationItem.findByPk(variationItemId);
			if (variationItem) {
				await variationItem.destroy();
				return true;
			}
			return false;
		} catch (err: any) {
			console.error("Error while deleting variationItem: ", err.message);
			throw err;
		}
	};

	// Add a new variation item
	createVariationItem = async (
		variationId: number,
		value: string,
		additionalPrice: number,
	): Promise<VariationItem | VariationItemAttributes | null> => {
		try {
			const variationItem = await VariationItem.create({
				variationId,
				value,
				additionalPrice,
			});
			return variationItem ? variationItem.toJSON() : null;
		} catch (err: any) {
			console.error("Error while adding variation item: ", err.message);
			throw err;
		}
	};

	// Remove a variation item
	removeVariationItem = async (variationItemId: number): Promise<boolean> => {
		try {
			const item = await VariationItem.findByPk(variationItemId);
			if (item) {
				await item.destroy();
				return true;
			}
			return false;
		} catch (err: any) {
			console.error("Error while deleting variation item: ", err.message);
			throw err;
		}
	};

	getAllVariation = async (
		filter: WhereOptions<VariationAttributes> = {},
		limit: number,
		offset: number,
		order: Order,
	): Promise<Variation[] | VariationAttributes[] | null> => {
		try {
			const variations = await Variation.findAll({
				where: filter,
				limit,
				offset,
				order,
				include: [{ model: VariationItem, as: "variationItems" }],
			});
			if (variations) {
				return variations.map((variation) => variation.toJSON());
			}
			return null;
		} catch (err: any) {
			console.log(
				"Error occurred while getting all variations: ".red,
				err.message,
			);
			throw err;
		}
	};

	getAllVariationItems = async (
		variationId: number,
	): Promise<VariationItem[] | VariationItemAttributes[] | null> => {
		try {
			const variationItems = await VariationItem.findAll({
				where: {
					variationId,
				},
			});
			if (variationItems) {
				return variationItems.map((variationItem) =>
					variationItem.toJSON(),
				);
			}
			return null;
		} catch (err: any) {
			console.log(
				"Error occurred while getting all variation items: ".red,
				err.message,
			);
			throw err;
		}
	};
}

export default ProductVariationService;
