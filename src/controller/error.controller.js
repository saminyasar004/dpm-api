const { responseSender } = require("../util/index");
const multer = require("multer");

const errorController = (err, _req, res, _next) => {
	console.log("GLOBAL ERROR HANDLER: ".red, err.message);
	if (err instanceof multer.MulterError) {
		// Handle multer-specific errors
		switch (err.code) {
			case "LIMIT_FILE_SIZE":
				return responseSender(res, 400, "File size too large!");
			case "LIMIT_UNEXPECTED_FILE":
				return responseSender(res, 400, "Unexpected file format!");
			default:
				return responseSender(res, 400, err.message);
		}
	}
	responseSender(res, 500, "Internal server error occured.");
};

module.exports = errorController;
