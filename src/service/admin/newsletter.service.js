const Newsletter = require("../../model/admin/newsletter.model");

const newsletterService = {};

/**
 * subscribe new email
 *
 * @param {string} email
 * @param {string} verificationToken
 * @returns {Promise<Newsletter>}
 */
newsletterService.subscribe = async (email, verificationToken) => {
	try {
		const newsletter = await Newsletter.create({
			email,
			is_verified: false,
			verification_token: verificationToken,
		});
		return newsletter.toJSON();
	} catch (err) {
		console.log(
			"Error occured while subscribing newsletter: ".red,
			err.message
		);
		throw err;
	}
};

/**
 * verify the email
 *
 * @param {string} email
 * @param {string} verificationToken
 * @returns {Promise<Newsletter>}
 */
newsletterService.verifyEmail = async (email, verificationToken) => {
	try {
		const newsletter = await Newsletter.findOne({
			where: { email, verification_token: verificationToken },
		});
		if (newsletter) {
			newsletter.is_verified = true;
			await newsletter.save();
			return newsletter.toJSON();
		}
		return null;
	} catch (err) {
		console.log("Error occured while verifying email: ".red, err.message);
		throw err;
	}
};

/**
 * unsubscribe an email
 *
 * @param {string} email
 * @param {string} verificationToken
 * @returns {Promise<boolean>}
 */
newsletterService.unsubscribe = async (email, verificationToken) => {
	try {
		const newsletter = await Newsletter.findOne({
			where: { email, verification_token: verificationToken },
		});
		if (newsletter) {
			await newsletter.destroy();
			return true;
		}
		return false;
	} catch (err) {
		console.log(
			"Error occured while unsubscribing newsletter: ".red,
			err.message
		);
		throw err;
	}
};

/**
 * find newsletter by email
 *
 * @param {string} email
 * @returns {Promise<Newsletter>}
 */
newsletterService.findByEmail = async (email) => {
	try {
		const newsletter = await Newsletter.findOne({ where: { email } });
		if (newsletter) {
			return newsletter.toJSON();
		}
		return null;
	} catch (err) {
		console.log(
			"Error occured while getting newsletter by email: ".red,
			err.message
		);
		throw err;
	}
};

module.exports = newsletterService;
