import { responseSender } from "../util";
import multer from "multer";
import { Request, Response, NextFunction } from "express";

const errorController = (
	err: Error,
	_req: Request,
	res: Response,
	_next: NextFunction,
) => {
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

export default errorController;
