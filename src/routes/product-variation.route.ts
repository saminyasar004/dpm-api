import express from "express";
import AuthMiddleware from "@/middleware/auth.middleware";
import { strictLimiter } from "@/middleware/rateLimiter.middleware";
import ProductVariationController from "@/controller/product-variation.controller";
import ProductVariationMiddleware from "@/middleware/product-variation.middleware";

const productVariationController = new ProductVariationController();
const productVariationMiddleware = new ProductVariationMiddleware();
const authMiddleware = new AuthMiddleware();

const productVariationRouter = express.Router();

productVariationRouter.post(
	"/create",
	strictLimiter,
	authMiddleware.authenticate(["admin"]),
	productVariationMiddleware.validateProductVariationCreation,
	productVariationController.createVariation,
);

productVariationRouter.get(
	"/",
	productVariationMiddleware.validateFilteringQueries,
	productVariationController.getAllVariations,
);

productVariationRouter.put(
	"/",
	authMiddleware.authenticate(["admin"]),
	productVariationMiddleware.validateProductVariationEdit,
	productVariationController.updateVariation,
);

export default productVariationRouter;
