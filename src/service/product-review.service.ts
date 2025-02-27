import Customer from "@/model/customer.model";
import ProductImage from "@/model/product-image.model";
import ProductReview, {
	ProductReviewAttributes,
} from "@/model/product-review.model";
import Product from "@/model/product.model";
import { Op, Order, WhereOptions } from "sequelize";

class ProductReviewService {
	// create a new product review
	createReview = async (
		rating: number,
		description: string,
		productId: number,
		customerId: number,
	): Promise<ProductReview | ProductReviewAttributes | null> => {
		try {
			const review = await ProductReview.create({
				rating,
				description,
				productId,
				customerId,
			});

			if (!review) {
				return null;
			}

			const createdReview = await ProductReview.findByPk(
				review.reviewId,
				{
					include: [
						{
							model: Product,
							attributes: ["name"],
						},
						{
							model: Customer,
							attributes: ["name", "email"],
						},
					],
				},
			);

			return createdReview ? createdReview.toJSON() : null;
		} catch (err: any) {
			console.error("Error while creating product review: ", err.message);
			throw err;
		}
	};

	// Get a review by reviewId
	getReviewByReviewId = async (
		reviewId: number,
	): Promise<ProductReview | ProductReviewAttributes | null> => {
		try {
			const review = await ProductReview.findByPk(reviewId, {
				include: [
					{
						model: Product,
						attributes: ["name"],
					},
					{
						model: Customer,
						attributes: ["name", "email"],
					},
				],
			});
			return review ? review.toJSON() : null;
		} catch (err: any) {
			console.error(
				"Error while fetching product review by id: ",
				err.message,
			);
			throw err;
		}
	};

	// set status by review id
	setStatusById = async (
		reviewId: number,
		status: "published" | "unpublished",
	): Promise<boolean> => {
		try {
			const [updatedRows] = await ProductReview.update(
				{ status },
				{
					where: { reviewId },
				},
			);
			return updatedRows > 0;
		} catch (err: any) {
			console.error("Error while deleting product review: ", err.message);
			throw err;
		}
	};

	// Delete a review by id
	deleteReviewById = async (reviewId: number): Promise<boolean> => {
		try {
			const review = await ProductReview.findByPk(reviewId);
			if (review) {
				await review.destroy();
				return true;
			}
			return false;
		} catch (err: any) {
			console.error("Error while deleting product review: ", err.message);
			throw err;
		}
	};

	getAllReviews = async (
		filter: WhereOptions<ProductReviewAttributes> = {},
		limit: number,
		offset: number,
		order: Order,
	): Promise<ProductReview[] | ProductReviewAttributes[] | null> => {
		try {
			const reviews = await ProductReview.findAll({
				where: filter,
				limit,
				offset,
				order,
				include: [
					{
						model: Product,
						as: "Product",
						attributes: ["name"],
					},
					{
						model: Customer,
						as: "Customer",
						attributes: ["name", "email"],
					},
				],
			});
			if (reviews) {
				return reviews.map((variation) => variation.toJSON());
			}
			return null;
		} catch (err: any) {
			console.log(
				"Error occurred while getting all product reviews: ".red,
				err.message,
			);
			throw err;
		}
	};
}

export default ProductReviewService;
