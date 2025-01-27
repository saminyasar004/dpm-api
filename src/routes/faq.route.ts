import express from "express";
import FaqController from "@/controller/faq.controller";
import FaqMiddleware from "@/middleware/faq.middleware";
import AuthMiddleware from "@/middleware/auth.middleware";
import { apiLimiter, strictLimiter } from "@/middleware/rateLimiter.middleware";

const faqController = new FaqController();
const faqMiddleware = new FaqMiddleware();
const authMiddleware = new AuthMiddleware();

const faqRouter = express.Router();

faqRouter.post(
	"/add",
	strictLimiter,
	authMiddleware.authenticate(["admin"]),
	faqMiddleware.validateFaqCreation,
	faqController.addNewFaq,
);

faqRouter.get(
	"/",
	apiLimiter,
	authMiddleware.authenticate(["admin"]),
	faqController.getAllFaq,
);

export default faqRouter;
