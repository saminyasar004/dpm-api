const User = require("../../model/admin/user.model");
const userService = {};

/**
 * create new user
 *
 * @param {string} name
 * @param {string} email
 * @param {string} password
 * @param {string} role
 * @returns {Promise<User>}
 */
userService.registerUser = async (
	name,
	email,
	password,
	role,
	avatar = "null"
) => {
	try {
		const user = await User.create({
			name,
			email,
			password,
			role,
			avatar,
		});
		return user.toJSON();
	} catch (err) {
		console.log("Error occured while creating user: ".red, err.message);
		throw err;
	}
};

/**
 * upload user avatar
 *
 * @param {number} userId
 * @param {string} avatarPath
 * @returns {Promise<User>}
 */
userService.uploadUserAvatar = async (userId, avatarPath) => {
	try {
		const user = await User.findOne({ where: { user_id: userId } });
		if (user) {
			user.avatar = avatarPath;
			await user.save();
			return user.toJSON();
		}
		return null;
	} catch (err) {
		console.log(
			"Error occured while uploading user avatar: ".red,
			err.message
		);
		throw err;
	}
};

/**
 * return user by email
 *
 * @param {string} email
 * @returns {Promise<User>}
 */
userService.getUserByEmail = async (email) => {
	try {
		const user = await User.findOne({ where: { email } });
		if (user) {
			return user.toJSON();
		}
		return null;
	} catch (err) {
		console.log(
			"Error occured while getting user by email: ".red,
			err.message
		);
		throw err;
	}
};

/**
 * return all users
 *
 * @returns {Promise<User[]>}
 */
userService.getAllUsers = async () => {
	try {
		const users = await User.findAll();
		if (users) {
			return users.map((user) => user.toJSON());
		}
		return null;
	} catch (err) {
		console.log("Error occured while getting all users: ".red, err.message);
		throw err;
	}
};

module.exports = userService;
