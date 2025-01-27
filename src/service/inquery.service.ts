import Inquery, { InqueryAttributes } from "@/model/inquery.model";
import { Order, WhereOptions } from "sequelize";

class InqueryService {
	createInquery = async (
		name: string,
		email: string,
		phone: string,
		company: string,
		inqueryType: string,
		message: string,
		designFile: string,
		status: "open" | "closed" = "open",
	): Promise<Inquery | InqueryAttributes | null> => {
		try {
			const inquery = await Inquery.create({
				name,
				email,
				phone,
				company,
				inqueryType,
				message,
				designFile,
				status,
			});
			const createdInquery = await Inquery.findByPk(inquery.inqueryId);
			if (createdInquery) {
				return createdInquery.toJSON();
			}
			return null;
		} catch (err: any) {
			console.log(
				"Error occured while creating inquery: ".red,
				err.message,
			);
			throw err;
		}
	};

	closeInquery = async (
		inqueryId: number,
	): Promise<Inquery | InqueryAttributes | null> => {
		try {
			const inquery = await Inquery.findOne({
				where: { inqueryId },
			});
			if (inquery) {
				inquery.status = "closed";
				await inquery.save();
				return inquery.toJSON();
			}
			return null;
		} catch (err: any) {
			console.log(
				"Error occured while closing inquery: ".red,
				err.message,
			);
			throw err;
		}
	};

	getAllInqueries = async (
		filter: WhereOptions<InqueryAttributes>,
		limit: number,
		offset: number,
		order: Order,
	): Promise<Inquery[] | InqueryAttributes[] | null> => {
		try {
			const inqueries = await Inquery.findAll({
				where: filter,
				limit,
				offset,
				order,
			});
			if (inqueries) {
				return inqueries.map((inquery) => inquery.toJSON());
			}
			return null;
		} catch (err: any) {
			console.log(
				"Error occured while getting inquery: ".red,
				err.message,
			);
			throw err;
		}
	};
}

export default InqueryService;
