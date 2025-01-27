import InqueryService from "@/service/inquery.service";
import { responseSender } from "@/util";
import { InqueryAttributes } from "@/model/inquery.model";
import { Op, Order, WhereOptions } from "sequelize";
import { Request, Response, NextFunction } from "express";
import path from "path";
import fs from "fs";

class InqueryController {
	private inqueryService: InqueryService;

	constructor() {
		this.inqueryService = new InqueryService();
	}

	createInquery = async (req: Request, res: Response, next: NextFunction) => {
		try {
			const fileValidationError = (req as any).fileValidationError;
			if (fileValidationError) {
				return responseSender(res, 400, fileValidationError);
			}

			const newInquery = (req as any).validatedValue;
			newInquery.designFile = (req.file && req.file.filename) || "null";
			const inquery = await this.inqueryService.createInquery(
				newInquery.name,
				newInquery.email,
				newInquery.phone,
				newInquery.company,
				newInquery.inqueryType,
				newInquery.message,
				newInquery.designFile,
			);

			if (!inquery) {
				return responseSender(
					res,
					400,
					"Failed to create inquery. Please try again.",
				);
			}

			return responseSender(res, 200, "Inquery created successfully.", {
				inquery,
			});
		} catch (err: any) {
			// If database operation fails, delete the uploaded file
			if (req.file) {
				const filePath = path.join(
					req.file.destination,
					req.file.filename,
				);

				fs.unlink(filePath, (unlinkErr) => {
					if (unlinkErr)
						console.log(
							"Error deleting uploaded file: ".red,
							unlinkErr.message,
						);
				});
			}

			console.log(
				"Error occured while creating inquery: ".red,
				err.message,
			);
			next(err);
		}
	};

	getAllInqueries = async (
		req: Request,
		res: Response,
		next: NextFunction,
	) => {
		try {
			const searchTerm = (req as any).validatedValue.searchTerm;
			const searchBy = (req as any).validatedValue.searchBy;
			const inqueryType = (req as any).validatedValue.inqueryType;
			const status = (req as any).validatedValue.status;
			const currentPage = parseInt((req as any).validatedValue.page || 1);
			const limitPerPage = parseInt(
				(req as any).validatedValue.limit || 20,
			);
			const offset = (currentPage - 1) * limitPerPage;
			const order: Order = [["createdAt", "DESC"]];
			const filter: WhereOptions<InqueryAttributes> = {};

			if (inqueryType) {
				filter.inqueryType = inqueryType;
			}

			if (status) {
				filter.status = status;
			}

			if (searchTerm && searchBy) {
				switch (searchBy) {
					case "name":
						filter.name = {
							[Op.like]: `%${searchTerm}%`,
						};
						break;
					case "email":
						filter.email = {
							[Op.like]: `%${searchTerm}%`,
						};
						break;
					default:
						break;
				}
			}

			const inqueries = await this.inqueryService.getAllInqueries(
				filter,
				limitPerPage,
				offset,
				order,
			);
			if (!inqueries) {
				return responseSender(
					res,
					400,
					"Failed to get inqueries. Please try again.",
				);
			}
			return responseSender(res, 200, "Inqueries fetched successfully.", {
				inqueries,
			});
		} catch (err: any) {
			console.log(
				"Error occured while fetching inqueries: ".red,
				err.message,
			);
			next(err);
		}
	};

	closeInquery = async (req: Request, res: Response, next: NextFunction) => {
		try {
			const inquery = await this.inqueryService.closeInquery(
				(req as any).validatedValue.inqueryId,
			);

			if (!inquery) {
				return responseSender(
					res,
					400,
					"Failed to close inquery. Please try again.",
				);
			}
			return responseSender(res, 200, "Inquery closed successfully.");
		} catch (err: any) {
			console.log(
				"Error occured while closing inquery: ".red,
				err.message,
			);
			next(err);
		}
	};
}

export default InqueryController;
