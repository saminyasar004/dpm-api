const express = require("express");
const userController = require("../../controller/admin/user.controller");
const userMiddleware = require("../../middleware/admin/user.middleware");
const imageUploaderMiddleware = require("../../middleware/admin/imageUploader.middleware");
const {
	apiLimiter,
	strictLimiter,
} = require("../../middleware/rateLimiter.middleware");
const authMiddleware = require("../../middleware/admin/auth.middleware");

const userRouter = express.Router();

userRouter.use(apiLimiter);

// register new user
userRouter.post(
	"/register",
	strictLimiter,
	userMiddleware.validateUserRegistration,
	userController.registerUser
);

// login an user
userRouter.post(
	"/login",
	strictLimiter,
	userMiddleware.validateUserLogin,
	userController.loginUser
);

// upload user avatar
userRouter.post(
	"/avatar",
	strictLimiter,
	authMiddleware.authUser,
	imageUploaderMiddleware.uploader("images").single("avatar"),
	imageUploaderMiddleware.compressImage,
	userController.uploadUserAvatar
);

module.exports = userRouter;
