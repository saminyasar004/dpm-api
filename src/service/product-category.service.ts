import ProductCategory, {
	ProductCategoryAttributes,
	ProductCategoryCreationAttributes,
} from "../model/product-category.model";
import Product from "../model/product.model";
import { createSlug } from "../util";
import { Order, WhereOptions } from "sequelize";

class ProductCategoryService {
	// Create a new category
	createCategory = async (
		name: string,
		parentCategoryId?: number | null,
	): Promise<ProductCategory | ProductCategoryAttributes | null> => {
		try {
			const category = await ProductCategory.create({
				name,
				slug: createSlug(name),
				parentCategoryId,
			});
			return category ? category.toJSON() : null;
		} catch (err: any) {
			console.log("Error creating category: ", err.message);
			throw err;
		}
	};

	// Get category by slug
	getCategoryBySlug = async (
		slug: string,
	): Promise<ProductCategory | ProductCategoryAttributes | null> => {
		try {
			const category = await ProductCategory.findOne({
				where: { slug },
			});
			return category ? category.toJSON() : null;
		} catch (err: any) {
			console.log("Error fetching category: ", err.message);
			throw err;
		}
	};

	// Get category by ID
	getCategoryById = async (
		categoryId: number,
	): Promise<ProductCategory | ProductCategoryAttributes | null> => {
		try {
			const category = await ProductCategory.findByPk(categoryId, {
				include: [
					{ model: ProductCategory, as: "parentCategory" },
					{ model: ProductCategory, as: "subCategories" },
					{ model: Product, as: "products" },
				],
			});
			return category ? category.toJSON() : null;
		} catch (err: any) {
			console.log("Error fetching category: ", err.message);
			throw err;
		}
	};

	// Update category
	updateCategory = async (
		categoryId: number,
		name: string,
		parentCategoryId: number | null,
	): Promise<boolean> => {
		try {
			const [updatedRows] = await ProductCategory.update(
				{ name, slug: createSlug(name), parentCategoryId },
				{
					where: { categoryId },
				},
			);
			return updatedRows > 0;
		} catch (err: any) {
			console.log("Error updating category: ", err.message);
			throw err;
		}
	};

	// Delete category
	deleteCategory = async (categoryId: number): Promise<boolean> => {
		try {
			const category = await ProductCategory.findByPk(categoryId);
			if (category) {
				await category.destroy();
				return true;
			}
			return false;
		} catch (err: any) {
			console.log("Error deleting category: ", err.message);
			throw err;
		}
	};

	// Get all categories with optional filtering
	getAllCategories = async (
		filter: WhereOptions<ProductCategoryAttributes> = {},
		limit: number,
		offset: number,
		order: Order,
	): Promise<ProductCategory[] | ProductCategoryAttributes[] | null> => {
		try {
			const categories = await ProductCategory.findAll({
				where: filter,
				limit,
				offset,
				order,
				include: [
					{ model: ProductCategory, as: "parentCategory" },
					{ model: ProductCategory, as: "subCategories" },
					{ model: Product, as: "products" },
				],
			});
			if (categories) {
				return categories.map((category) => category.toJSON());
			}
			return null;
		} catch (err: any) {
			console.log("Error fetching categories: ", err.message);
			throw err;
		}
	};
}

export default ProductCategoryService;
