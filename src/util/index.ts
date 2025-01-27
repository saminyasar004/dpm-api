import bcrypt from "bcrypt";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import { v4 as uuid } from "uuid";
import path from "path";
import ejs from "ejs";
import { jwtSecret, jwtExpiresIn } from "@/config/dotenv.config";
import { Response } from "express";

export const responseSender = (
	res: Response,
	status: number,
	message: string,
	data?: {},
): void => {
	const responseData = {
		status: status,
		message: message,
		data,
	};

	res.header("Content-Type", "application/json");
	res.status(status).json(responseData);
};

export const hashedPassword = async (password: string): Promise<string> => {
	const saltRound = 10;
	try {
		return await bcrypt.hash(password, saltRound);
	} catch (err: any) {
		console.log("Error occured while hashing password: ".red, err.message);
		throw err;
	}
};

export const comparePassword = async (
	password: string,
	hashedPassword: string,
): Promise<boolean> => {
	try {
		return await bcrypt.compare(password, hashedPassword);
	} catch (err: any) {
		console.log(
			"Error occured while comparing password: ".red,
			err.message,
		);
		throw err;
	}
};

export const generateJWTToken = (payload: {}): string => {
	try {
		return jwt.sign(payload, jwtSecret, { expiresIn: jwtExpiresIn });
	} catch (err: any) {
		console.log("Error occured while generating token: ".red, err.message);
		throw err;
	}
};

export const verifyToken = (token: string): any => {
	try {
		return jwt.verify(token, jwtSecret);
	} catch (err: any) {
		console.log("Error occured while verifying token: ".red, err.message);
		throw err;
	}
};

export const generateOTP = (length: number = 6): string => {
	if (length < 6) length = 6;

	const digits = "0123456789";
	let otp = "";

	for (let i = 0; i < length; i++) {
		const randomIndex = crypto.randomInt(0, digits.length); // Get a random index
		otp += digits[randomIndex]; // Append the digit to the OTP
	}

	return otp;
};

export const generateVerificationToken = (): string => {
	return uuid().toString().replace(/-/gi, "");
};

export const loadTemplate = async (templateName: string, variables: {}) => {
	try {
		const templatePath = path.join(
			__dirname,
			`../template/${templateName}.ejs`,
		);
		return await ejs.renderFile(templatePath, variables);
	} catch (err: any) {
		console.log(
			"Error occured while loading email template: ".red,
			err.message,
		);
		console.log(err.message);
	}
};
