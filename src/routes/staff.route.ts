import express from "express";
import StaffController from "@/controller/staff.controller";
import StaffMiddleware from "@/middleware/staff.middleware";
import AuthMiddleware from "@/middleware/auth.middleware";
import ImageUploaderMiddleware from "@/middleware/imageUploader.middleware";
import { apiLimiter, strictLimiter } from "@/middleware/rateLimiter.middleware";

const staffController = new StaffController();
const staffMiddleware = new StaffMiddleware();
const authMiddleware = new AuthMiddleware();
const imageUploaderMiddleware = new ImageUploaderMiddleware();

const staffRouter = express.Router();

staffRouter.use(apiLimiter);

// register new staff
staffRouter.post(
	"/register",
	strictLimiter,
	staffMiddleware.validateStaffRegistration,
	staffController.registerStaff,
);

// login an staff
staffRouter.post(
	"/login",
	strictLimiter,
	staffMiddleware.validateStaffLogin,
	staffController.loginStaff,
);

// upload staff avatar
staffRouter.post(
	"/avatar",
	strictLimiter,
	authMiddleware.authenticate(["agent", "designer"]),
	imageUploaderMiddleware.uploader("avatars").single("avatar"),
	imageUploaderMiddleware.compressImage,
	staffController.uploadStaffAvatar,
);

// update staff information
staffRouter.put(
	"/update",
	strictLimiter,
	authMiddleware.authenticate(["agent", "designer"]),
	staffMiddleware.validateStaffUpdate,
	staffController.updateStaff,
);

export default staffRouter;
