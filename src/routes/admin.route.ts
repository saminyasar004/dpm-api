import express from "express";
import AdminController from "@/controller/admin.controller";
import AdminMiddleware from "@/middleware/admin.middleware";
import AuthMiddleware from "@/middleware/auth.middleware";
import ImageUploaderMiddleware from "@/middleware/imageUploader.middleware";
import { apiLimiter, strictLimiter } from "@/middleware/rateLimiter.middleware";

const adminController = new AdminController();
const adminMiddleware = new AdminMiddleware();
const authMiddleware = new AuthMiddleware();
const adminImageUploader = new ImageUploaderMiddleware();

const adminRouter = express.Router();

adminRouter.use(apiLimiter);

// register new admin
adminRouter.post(
	"/register",
	strictLimiter,
	adminMiddleware.validateAdminRegistration,
	adminController.registerAdmin,
);

// login an admin
adminRouter.post(
	"/login",
	strictLimiter,
	adminMiddleware.validateAdminLogin,
	adminController.loginAdmin,
);

// upload user avatar
adminRouter.post(
	"/avatar",
	strictLimiter,
	authMiddleware.authenticate(["admin"]),
	adminImageUploader.uploader("avatars").single("avatar"),
	adminImageUploader.compressImage,
	adminController.uploadAdminAvatar,
);

// update admin (name/password)
adminRouter.put(
	"/",
	strictLimiter,
	authMiddleware.authenticate(["admin"]),
	adminMiddleware.validateAdminUpdate,
	adminController.updateAdmin,
);

export default adminRouter;
