require("dotenv").config();
const url = require("url");

const nodeEnv = process.env.NODE_ENV || "development";
const serverBaseUrl = url
	.resolve(
		"",
		`${process.env.SERVER_BASE_URL}:${process.env.SERVER_PORT}`.toString()
	)
	.slice(0, -1);
const serverUrlPrefix = process.env.SERVER_URL_PREFIX;
const port = process.env.SERVER_PORT || 3000;
const apiDocsUrl = process.env.API_DOCS_URL;

const dbName =
	nodeEnv === "production"
		? process.env.PRODUCTION_DB_NAME
		: process.env.DEVELOPMENT_DB_NAME;
const dbUser =
	nodeEnv === "production"
		? process.env.PRODUCTION_DB_USER
		: process.env.DEVELOPMENT_DB_USER;
const dbPassword =
	nodeEnv === "production"
		? process.env.PRODUCTION_DB_PASSWORD
		: process.env.DEVELOPMENT_DB_PASSWORD;
const dbHost =
	nodeEnv === "production"
		? process.env.PRODUCTION_DB_HOST
		: process.env.DEVELOPMENT_DB_HOST;

const rateLimitWindow = process.env.RATE_LIMIT_WINDOW;
const rateLimitMax = process.env.RATE_LIMIT_MAX;
const strictRateLimitWindow = process.env.STRICT_RATE_LIMIT_WINDOW;
const strictRateLimitMax = process.env.STRICT_RATE_LIMIT_MAX;

const apiWhitelistedDomains = process.env.API_WHITELISTED_DOMAINS.split(" ");

const jwtSecret = process.env.JWT_SECRET;
const jwtExpiresIn = process.env.JWT_EXPIRES_IN;

module.exports = {
	serverBaseUrl,
	nodeEnv,
	serverUrlPrefix,
	port,
	apiDocsUrl,
	dbName,
	dbUser,
	dbPassword,
	dbHost,
	rateLimitWindow,
	rateLimitMax,
	strictRateLimitWindow,
	strictRateLimitMax,
	apiWhitelistedDomains,
	jwtSecret,
	jwtExpiresIn,
};
