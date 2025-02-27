import { Request, Response, NextFunction } from "express";
import { responseSender } from "@/util";
import ProductVariationService from "@/service/product-variation.service";
import { Op, Order, WhereOptions } from "sequelize";
import { VariationAttributes } from "@/model/variation.model";

class ProductVariationController {
	private productVariationService: ProductVariationService;

	constructor() {
		this.productVariationService = new ProductVariationService();
	}

	createVariation = async (
		req: Request,
		res: Response,
		next: NextFunction,
	) => {
		try {
			const createdVariation =
				await this.productVariationService.createVariation(
					(req as any).validatedValue.name,
					(req as any).validatedValue.unit,
				);

			if (!createdVariation) {
				return responseSender(
					res,
					500,
					"Product variatoin creation failed. Please try again.",
				);
			}

			try {
				for (const variationItem of (req as any).validatedValue
					.variationItems) {
					await this.productVariationService.createVariationItem(
						createdVariation.variationId,
						variationItem.value,
						variationItem.additionalPrice,
					);
				}

				const newVariation =
					await this.productVariationService.getVariationById(
						createdVariation.variationId,
					);

				return responseSender(
					res,
					200,
					"variation created successfully.",
					{
						variation: newVariation,
					},
				);
			} catch (err: any) {
				console.log(
					"Error occures while creating new variation item in controller: "
						.red,
					err.message,
				);
				next(err);
			}
		} catch (err: any) {
			console.log(
				"Error occured while creating product variation: ".red,
				err.message,
			);
			next(err);
		}
	};

	updateVariation = async (
		req: Request,
		res: Response,
		next: NextFunction,
	) => {
		try {
			const { variationId, name, unit, variationItems } = (req as any)
				.validatedValue;

			// Update the variation
			const isUpdated =
				await this.productVariationService.updateVariation(
					variationId,
					name,
					unit,
					variationItems,
				);

			if (!isUpdated) {
				return responseSender(
					res,
					500,
					"Failed to update variation. Please try again.",
				);
			}

			return responseSender(res, 200, "Variation updated successfully.");
		} catch (err: any) {
			console.log(
				"Error occurred while updating variation in controller: ".red,
				err.message,
			);
			next(err);
		}
	};

	getAllVariations = async (
		req: Request,
		res: Response,
		next: NextFunction,
	) => {
		try {
			const searchTerm = (req as any).validatedValue.searchTerm;
			const currentPage = parseInt((req as any).validatedValue.page || 1);
			const limitPerPage = parseInt(
				(req as any).validatedValue.limit || 20,
			);
			const offset = (currentPage - 1) * limitPerPage;
			const order: Order = [["createdAt", "DESC"]];
			const filter: WhereOptions<VariationAttributes> = {};

			if (searchTerm) {
				filter.name = {
					[Op.like]: `%${searchTerm}%`,
				};
			}

			const variations =
				await this.productVariationService.getAllVariation(
					filter,
					limitPerPage,
					offset,
					order,
				);

			if (!variations) {
				return responseSender(
					res,
					400,
					"Cannot find variations. Please try again.",
				);
			}

			return responseSender(res, 200, "Variation fetched successfully.", {
				variations,
			});
		} catch (err: any) {
			console.log(
				"Error occures while getting all variation in controller: ".red,
				err.message,
			);
			next(err);
		}
	};
}

export default ProductVariationController;
