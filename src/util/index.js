const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { jwtSecret, jwtExpiresIn } = require("../config/dotenv.config");

/**
 * send custom responses
 *
 * @param {import("express").Response} res
 * @param {number} status
 * @param {string|object} message
 */
const responseSender = (res, status, message) => {
	const responseData = {
		status: status,
		message: message,
	};

	res.header("Content-Type", "application/json");
	res.status(status).json(responseData);
};

/**
 * hash password
 *
 * @param {string} password
 * @returns {Promise<string>} hashed password
 */
const hashedPassword = async (password) => {
	const saltRound = 10;
	try {
		return await bcrypt.hash(password, saltRound);
	} catch (err) {
		console.log("Error occured while hashing password: ".red, err.message);
		throw err;
	}
};

/**
 * compare password with hashed password
 *
 * @param {string} password
 * @param {string} hashedPassword
 * @returns {Promise<boolean>}
 */
const comparePassword = async (password, hashedPassword) => {
	try {
		return await bcrypt.compare(password, hashedPassword);
	} catch (err) {
		console.log(
			"Error occured while comparing password: ".red,
			err.message
		);
		throw err;
	}
};

/**
 * generate token
 *
 * @param {any} payload
 * @returns {string}
 */
const generateToken = (payload) => {
	try {
		return jwt.sign(payload, jwtSecret, { expiresIn: jwtExpiresIn });
	} catch (err) {
		console.log("Error occured while generating token: ".red, err.message);
		throw err;
	}
};

/**
 * verify token
 *
 * @param {string} token
 * @returns {}
 */
const verifyToken = (token) => {
	try {
		return jwt.verify(token, jwtSecret);
	} catch (err) {
		console.log("Error occured while verifying token: ".red, err.message);
		throw err;
	}
};

module.exports = {
	responseSender,
	hashedPassword,
	comparePassword,
	generateToken,
	verifyToken,
};
