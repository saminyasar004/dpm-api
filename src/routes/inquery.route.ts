import express from "express";
import AuthMiddleware from "@/middleware/auth.middleware";
import InqueryMiddleware from "@/middleware/inquery.middleware";
import InqueryController from "@/controller/inquery.controller";
import { apiLimiter } from "@/middleware/rateLimiter.middleware";
import ImageUploaderMiddleware from "@/middleware/imageUploader.middleware";

const authMiddleware = new AuthMiddleware();
const inqueryMiddleware = new InqueryMiddleware();
const inqueryController = new InqueryController();
const inqueryImageUploader = new ImageUploaderMiddleware();

const inqueryRouter = express.Router();

inqueryRouter.use(apiLimiter);

inqueryRouter.get(
	"/",
	authMiddleware.authenticate(["admin"]),
	inqueryMiddleware.validateFilteringQueries,
	inqueryController.getAllInqueries,
);

inqueryRouter.post(
	"/create-inquery",
	inqueryImageUploader.uploader("inqueries").single("designFile"),
	inqueryImageUploader.compressImage,
	inqueryMiddleware.validateInqueryCreation,
	inqueryController.createInquery,
);

inqueryRouter.get(
	"/close",
	authMiddleware.authenticate(["admin"]),
	inqueryMiddleware.validateInqueryClose,
	inqueryController.closeInquery,
);

export default inqueryRouter;
