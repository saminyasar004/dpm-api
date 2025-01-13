const rateLimit = require("express-rate-limit");

const {
	rateLimitWindow,
	rateLimitMax,
	strictRateLimitWindow,
	strictRateLimitMax,
} = require("../config/dotenv.config");

const apiLimiter = rateLimit({
	windowMs: rateLimitWindow * 60 * 1000, // 15 minutes
	max: rateLimitMax, // Limit each IP to 100 requests per `window` (15 minutes)
	message: {
		status: 429,
		error: "Too many requests from this IP, please try again later.",
	},
	headers: true, // Adds rate limit info in headers
});

const strictLimiter = rateLimit({
	windowMs: strictRateLimitWindow * 60 * 1000, // 1 minute
	max: strictRateLimitMax, // Limit each IP to 10 requests per minute
	message: {
		status: 429,
		error: "Too many requests, please slow down.",
	},
	headers: true,
});

module.exports = {
	apiLimiter,
	strictLimiter,
};
