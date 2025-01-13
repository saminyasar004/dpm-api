const newsletterService = require("../../service/admin/newsletter.service");
const { responseSender } = require("../../util");
const { v4: uuid } = require("uuid");
const urlJoin = require("url-join");
const {
	serverBaseUrl,
	serverUrlPrefix,
} = require("../../config/dotenv.config");

const newsletterController = {};

newsletterController.subscribe = async (req, res, next) => {
	try {
		const email = req.body.email.trim();

		const isEmailExists = await newsletterService.findByEmail(email);
		if (isEmailExists) {
			return responseSender(res, 400, "You have already subscribed.");
		}

		const verificationToken = uuid().toString().replace(/-/gi, "");
		const newsletter = await newsletterService.subscribe(
			email,
			verificationToken
		);
		if (!newsletter) {
			return responseSender(
				res,
				500,
				"Something went wrong. Please try again."
			);
		}
		const verificationUrl = urlJoin(
			serverBaseUrl,
			serverUrlPrefix,
			`/newsletter/verify?email=${email}&token=${verificationToken}`
		);
		const unsubscribeUrl = urlJoin(
			serverBaseUrl,
			serverUrlPrefix,
			`/newsletter/unsubscribe?email=${email}&token=${verificationToken}`
		);
		return responseSender(res, 200, {
			message: "You have subscribed successfully.",
			verificationUrl,
			unsubscribeUrl,
		});
	} catch (err) {
		console.log(
			"Error occured while subscribing newsletter: ".red,
			err.message
		);
		next(err);
	}
};

newsletterController.verifyEmail = async (req, res, next) => {
	try {
		const email = req.query.email.trim();
		const verificationToken = req.query.token.trim();

		const isEmailExists = await newsletterService.findByEmail(email);
		if (!isEmailExists) {
			return responseSender(res, 400, "You have not subscribed.");
		}

		const isVerified = await newsletterService.verifyEmail(
			email,
			verificationToken
		);
		if (isVerified) {
			return responseSender(res, 200, "You have verified email.");
		}
		return responseSender(res, 400, "Invalid token. Please try again.");
	} catch (err) {
		console.log("Error occured while verifying email: ".red, err.message);
		next(err);
	}
};

newsletterController.unsubscribe = async (req, res, next) => {
	try {
		const email = req.query.email.trim();
		const verificationToken = req.query.token.trim();

		const isEmailExists = await newsletterService.findByEmail(email);
		if (!isEmailExists) {
			return responseSender(res, 400, "You have not subscribed.");
		}

		const isUnsubscribed = await newsletterService.unsubscribe(
			email,
			verificationToken
		);
		if (!isUnsubscribed) {
			return responseSender(res, 400, "Invalid token. Please try again.");
		}
		return responseSender(res, 200, "You have unsubscribed successfully.");
	} catch (err) {
		console.log(
			"Error occured while unsubscribing newsletter: ".red,
			err.message
		);
		next(err);
	}
};

newsletterController.getAllSubscriber = async (_req, res, next) => {
	try {
		const subscribers = await newsletterService.getAll();
		if (!subscribers) {
			return responseSender(res, 400, "No subscribers found.");
		}

		subscribers.forEach((subscriber) => {
			subscriber.verificationUrl = urlJoin(
				serverBaseUrl,
				serverUrlPrefix,
				`/newsletter/verify?email=${subscriber.email}&token=${subscriber.verification_token}`
			);
			subscriber.unsubscribeUrl = urlJoin(
				serverBaseUrl,
				serverUrlPrefix,
				`/newsletter/unsubscribe?email=${subscriber.email}&token=${subscriber.verification_token}`
			);
		});

		return responseSender(res, 200, subscribers);
	} catch (err) {
		console.log(
			"Error occured while getting all subscribers: ".red,
			err.message
		);
		next(err);
	}
};

module.exports = newsletterController;
