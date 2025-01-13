const { responseSender } = require("../util/index");

const notFoundController = (_req, res, next) => {
	next(responseSender(res, 404, "The requested content could not be found."));
};

module.exports = notFoundController;
