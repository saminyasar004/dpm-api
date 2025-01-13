const userService = require("../../service/admin/user.service");
const fs = require("fs");
const path = require("path");
const {
	responseSender,
	hashedPassword,
	comparePassword,
	generateToken,
} = require("../../util");

const userController = {};

// register user
userController.registerUser = async (req, res, next) => {
	try {
		const newUser = {
			name: req.body.name.trim(),
			email: req.body.email.trim(),
			password: await hashedPassword(req.body.password.trim()),
		};

		// check if the email already exists
		const isEmailExists = await userService.getUserByEmail(newUser.email);
		if (isEmailExists) {
			return responseSender(
				res,
				400,
				"User already exists with this email. Please login."
			);
		}

		// decide the user's role
		const existingUserList = await userService.getAllUsers();
		if (existingUserList.length === 0) {
			newUser.role = "owner";
		} else {
			const owner = existingUserList.find(
				(user) => user.role === "owner"
			);
			if (owner) {
				newUser.role = req.body.role.trim();
			}
		}

		const createdUser = await userService.registerUser(
			newUser.name,
			newUser.email,
			newUser.password,
			newUser.role
		);
		if (!createdUser) {
			return responseSender(
				res,
				400,
				"User registration failed. Please try again."
			);
		}
		// create jwt token
		delete createdUser.password;
		const authToken = generateToken(createdUser);

		return responseSender(res, 201, {
			message: "User registered successfully.",
			authToken,
		});
	} catch (err) {
		console.log("Error occured in user controller: ".red, err.message);
		next(err);
	}
};

// login user
userController.loginUser = async (req, res, next) => {
	try {
		const fetchedUser = await userService.getUserByEmail(
			req.body.email.trim()
		);
		if (!fetchedUser) {
			return responseSender(res, 400, "User not found. Please register.");
		}
		const isPasswordValid = await comparePassword(
			req.body.password.trim(),
			fetchedUser.password
		);
		if (!isPasswordValid) {
			return responseSender(
				res,
				400,
				"Invalid password. Please try again."
			);
		}
		// create jwt token
		delete fetchedUser.password;
		const authToken = generateToken(fetchedUser);

		return responseSender(res, 200, {
			message: "User logged in successfully.",
			user: fetchedUser,
			authToken,
		});
	} catch (err) {
		console.log("Error occured in user controller: ".red, err.message);
		next(err);
	}
};

// upload user avatar
userController.uploadUserAvatar = async (req, res, next) => {
	try {
		const fileValidationError = req.fileValidationError;
		if (fileValidationError) {
			return responseSender(res, 400, fileValidationError);
		}

		const fetchedUser = await userService.getUserByEmail(req.user.email);

		if (fetchedUser.avatar !== "null") {
			const previousAvatar = path.join(
				req.file.destination,
				fetchedUser.avatar
			);
			fs.unlink(previousAvatar, (unlinkErr) => {
				if (unlinkErr) {
					console.log(
						"Error deleting previous avatar: ".red,
						unlinkErr.message
					);
					throw unlinkErr;
				}
			});
		}

		const avatarPath = req.file.filename;

		const user = await userService.uploadUserAvatar(
			req.user.user_id,
			avatarPath
		);
		if (!user) {
			return responseSender(
				res,
				400,
				"User avatar upload failed. Please try again."
			);
		}

		return responseSender(res, 200, "User avatar uploaded successfully.");
	} catch (err) {
		// If database operation fails, delete the uploaded file
		const filePath = path.join(req.file.destination, req.file.filename);

		fs.unlink(filePath, (unlinkErr) => {
			if (unlinkErr)
				console.log(
					"Error deleting uploaded file: ".red,
					unlinkErr.message
				);
		});

		console.log("Error occured in user controller: ".red, err.message);
		next(err);
	}
};

module.exports = userController;
