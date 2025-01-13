const userService = require("../../service/admin/user.service");
const { responseSender, verifyToken } = require("../../util");

const authMiddleware = {};

authMiddleware.authUser = async (req, res, next) => {
	try {
		const authHeader = req.headers["authorization"];

		if (!authHeader) {
			return responseSender(res, 401, "Authorization token is missing.");
		}

		const authToken = authHeader.split(" ")[1];
		if (!authToken) {
			return responseSender(res, 401, "Authorization token is missing.");
		}

		try {
			const decodedToken = await verifyToken(authToken);

			if (!decodedToken) {
				return responseSender(res, 403, "Invalid authorization token.");
			}

			const user = await userService.getUserByEmail(decodedToken.email);

			if (!user) {
				return responseSender(res, 403, "Invalid authorization token.");
			}

			req.user = decodedToken;
			next();
		} catch (err) {
			console.log(
				"Error occured while verifying token: ".red,
				err.message
			);
			next(err);
		}
	} catch (err) {
		console.log("Error occured in auth middleware: ".red, err.message);
		next(err);
	}
};

module.exports = authMiddleware;
