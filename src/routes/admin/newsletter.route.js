const express = require("express");
const newsletterMiddleware = require("../../middleware/admin/newsletter.middleware");
const newsletterController = require("../../controller/admin/newsletter.controller");
const {
	apiLimiter,
	strictLimiter,
} = require("../../middleware/rateLimiter.middleware");

const newsletterRouter = express.Router();

newsletterRouter.use(apiLimiter);

newsletterRouter.get("/", newsletterController.getAllSubscriber);

newsletterRouter.post(
	"/subscribe",
	strictLimiter,
	newsletterMiddleware.validateEmailFromBody,
	newsletterController.subscribe
);

newsletterRouter.get(
	"/verify",
	newsletterMiddleware.validateEmailFromQuery,
	newsletterController.verifyEmail
);

newsletterRouter.get(
	"/unsubscribe",
	newsletterMiddleware.validateEmailFromQuery,
	newsletterController.unsubscribe
);

module.exports = newsletterRouter;
