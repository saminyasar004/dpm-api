import ProductService from "../service/product.service";
import { Request, Response, NextFunction } from "express";
import { responseSender } from "../util";
import { Op, Order, WhereOptions } from "sequelize";
import { ProductModelAttributes } from "../model/product.model";
import fs from "fs";
import path from "path";

class ProductController {
	private productService: ProductService;

	constructor() {
		this.productService = new ProductService();
	}

	createProduct = async (req: Request, res: Response, next: NextFunction) => {
		try {
			const newProduct = {
				name: (req as any).validatedValue.name,
				sku: (req as any).validatedValue.sku,
				tags: (req as any).validatedValue.tags,
				description: (req as any).validatedValue.description,
				basePrice: (req as any).validatedValue.basePrice,
				minOrderQuantity: (req as any).validatedValue.minOrderQuantity,
				pricingType: (req as any).validatedValue.pricingType,
				isActive: (req as any).validatedValue.isActive,
				categoryId: (req as any).validatedValue.categoryId,
				attributes: (req as any).validatedValue.attributes,
				variationItems: (req as any).validatedValue.variationItems,
				bulkDiscounts: (req as any).validatedValue.bulkDiscounts,
			};

			const createdProduct = await this.productService.createProduct(
				newProduct.name,
				newProduct.description,
				newProduct.sku,
				newProduct.basePrice,
				newProduct.minOrderQuantity,
				newProduct.pricingType,
				newProduct.categoryId,
				newProduct.isActive,
				newProduct.variationItems,
				newProduct.attributes,
				newProduct.bulkDiscounts,
			);

			if (!createdProduct) {
				return responseSender(
					res,
					500,
					"Product creation failed. Please try again.",
				);
			}

			return responseSender(res, 201, "Product created successfully.", {
				product: createdProduct,
			});
		} catch (err: any) {
			console.log(
				"Error occured while creating product: ".red,
				err.message,
			);
			next(err);
		}
	};

	createProductImage = async (
		req: Request,
		res: Response,
		next: NextFunction,
	) => {
		try {
			const fileValidationError = (req as any).fileValidationError;
			if (fileValidationError) {
				return responseSender(res, 400, fileValidationError);
			}

			const productId = req.body.productId;

			if (!productId) {
				if (req.files && Array.isArray(req.files)) {
					req.files.forEach((file) => {
						const filePath = path.join(
							file.destination,
							file.filename,
						);

						fs.unlink(filePath, (unlinkErr) => {
							if (unlinkErr) {
								console.log(
									"Error deleting uploaded file: ".red,
									unlinkErr.message,
								);
							}
						});
					});
				}

				return responseSender(
					res,
					400,
					"Product ID could not found. Please try again later.",
				);
			}

			if ((req as any).files.length > 0) {
				for (const image of (req as any).files) {
					await this.productService.createProductImage(
						image.filename,
						productId,
					);
				}
			}

			return responseSender(
				res,
				200,
				"Product image uploaded successfully.",
			);
		} catch (err: any) {
			// cleanup process if database operation failed
			if (req.files && Array.isArray(req.files)) {
				req.files.forEach((file) => {
					const filePath = path.join(file.destination, file.filename);

					fs.unlink(filePath, (unlinkErr) => {
						if (unlinkErr) {
							console.log(
								"Error deleting uploaded file: ".red,
								unlinkErr.message,
							);
						}
					});
				});
			}

			console.log(
				"Error occured while creating product: ".red,
				err.message,
			);
			next(err);
		}
	};

	getAllProducts = async (
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
			const filter: WhereOptions<ProductModelAttributes> = {};

			if (searchTerm) {
				filter.name = {
					[Op.like]: `%${searchTerm}%`,
				};
			}

			const products = await this.productService.getAllProducts(
				filter,
				limitPerPage,
				offset,
				order,
			);
			if (!products) {
				return responseSender(
					res,
					400,
					"Failed to get products. Please try again.",
				);
			}
			return responseSender(res, 200, "Products fetched successfully.", {
				products,
			});
		} catch (err: any) {
			console.log(
				"Error occured while creating product: ".red,
				err.message,
			);
			next(err);
		}
	};
}

export default ProductController;
