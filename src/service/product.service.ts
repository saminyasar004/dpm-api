import Product, {
	ProductModelAttributes,
	ProductModelCreationAttributes,
} from "@/model/product.model";
import ProductAttributes, {
	ProductAttributeCreationProps,
} from "@/model/product-attribute.model";
import ProductBulkDiscount, {
	ProductBulkDiscountCreationAttributes,
} from "@/model/product-bulk-discount.model";
import ProductImage from "@/model/product-image.model";
import ProductVariationItem from "@/model/product-variation-item.model";
import { WhereOptions, Order } from "sequelize";
import { createSlug } from "@/util";
import crypto from "crypto";

class ProductService {
	createProduct = async (
		name: string,
		description: string,
		sku: string,
		basePrice: number,
		minOrderQuantity: number,
		pricingType: "flat" | "square-feet",
		categoryId: number | null,
		isActive: boolean = true,
		variationItems: number[],
		attributes: ProductAttributeCreationProps[],
		bulkDiscounts: ProductBulkDiscountCreationAttributes[],
	): Promise<Product | ProductModelAttributes | null> => {
		try {
			const product = await Product.create({
				name,
				description,
				slug: createSlug(name),
				sku,
				basePrice,
				minOrderQuantity,
				pricingType,
				isActive,
				categoryId,
			});

			if (variationItems.length > 0) {
				await ProductVariationItem.bulkCreate(
					variationItems.map((variationItem) => ({
						variationItemId: variationItem,
						productId: product.productId,
					})),
				);
			}

			if (attributes.length > 0) {
				await ProductAttributes.bulkCreate(
					attributes.map((attribute) => ({
						...attribute,
						productId: product.productId,
					})),
				);
			}

			if (bulkDiscounts.length > 0) {
				await ProductBulkDiscount.bulkCreate(
					bulkDiscounts.map((discount) => ({
						...discount,
						productId: product.productId,
					})),
				);
			}

			return product ? product.toJSON() : null;
		} catch (err: any) {
			console.error(
				"Error occurred while creating product: ",
				err.message,
			);
			throw err;
		}
	};

	createProductImage = async (
		imageName: string,
		productId: number,
	): Promise<boolean> => {
		try {
			await ProductImage.create({ imageName, productId });
			return true;
		} catch (err: any) {
			console.error(
				"Error occurred while creating product image: ",
				err.message,
			);
			throw err;
		}
	};

	getProductById = async (
		productId: number,
	): Promise<ProductModelAttributes | null> => {
		try {
			const product = await Product.findByPk(productId, {
				include: [
					{ model: ProductAttributes, as: "attributes" },
					{ model: ProductBulkDiscount, as: "bulkDiscounts" },
					{ model: ProductImage, as: "images" },
					{
						model: ProductVariationItem,
						as: "variationItems",
					},
				],
			});

			return product ? product.toJSON() : null;
		} catch (err: any) {
			console.error(
				"Error occurred while fetching product by id: ",
				err.message,
			);
			throw err;
		}
	};

	updateProduct = async (
		productId: number,
		updateData: Partial<ProductModelCreationAttributes>,
	): Promise<boolean> => {
		try {
			const [updatedRows] = await Product.update(updateData, {
				where: { productId },
			});
			return updatedRows > 0;
		} catch (err: any) {
			console.error(
				"Error occurred while updating product: ",
				err.message,
			);
			throw err;
		}
	};

	deleteProduct = async (productId: number): Promise<boolean> => {
		try {
			const product = await Product.findByPk(productId);
			if (product) {
				await product.destroy();
				return true;
			}
			return false;
		} catch (err: any) {
			console.error(
				"Error occurred while deleting product: ",
				err.message,
			);
			throw err;
		}
	};

	getAllProducts = async (
		filter: WhereOptions<ProductModelAttributes>,
		limit: number,
		offset: number,
		order: Order,
	): Promise<Product[] | ProductModelAttributes[] | null> => {
		try {
			const products = await Product.findAll({
				where: filter,
				limit,
				offset,
				order,
				include: [
					{ model: ProductAttributes, as: "attributes" },
					{ model: ProductBulkDiscount, as: "bulkDiscounts" },
					{ model: ProductImage, as: "images" },
					{ model: ProductImage, as: "images" },
					{
						model: ProductVariationItem,
						as: "variationItems",
					},
				],
			});

			return products.map((product) => product.toJSON());
		} catch (err: any) {
			console.error(
				"Error occurred while fetching products: ",
				err.message,
			);
			throw err;
		}
	};

	addProductImage = async (
		imageName: string,
		productId: number,
	): Promise<boolean> => {
		try {
			await ProductImage.create({ imageName, productId });
			return true;
		} catch (err: any) {
			console.error(
				"Error occurred while adding product image: ",
				err.message,
			);
			throw err;
		}
	};

	removeProductImage = async (imageId: number): Promise<boolean> => {
		try {
			const image = await ProductImage.findByPk(imageId);
			if (image) {
				await image.destroy();
				return true;
			}
			return false;
		} catch (err: any) {
			console.error(
				"Error occurred while deleting product image: ",
				err.message,
			);
			throw err;
		}
	};

	generateUniqueSKU = async (): Promise<string> => {
		let sku: string;
		let exists: Product | null;

		do {
			const randomString = crypto
				.randomBytes(3)
				.toString("hex")
				.toUpperCase()
				.slice(0, 6);
			sku = `DPM-${randomString}`;
			exists = await Product.findOne({ where: { sku } });
		} while (exists);

		return sku;
	};
}

export default ProductService;
