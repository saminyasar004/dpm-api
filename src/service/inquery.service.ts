import InqueryImage from "../model/inquery-image.model";
import Inquery, { InqueryAttributes } from "../model/inquery.model";
import { Order, WhereOptions } from "sequelize";

class InqueryService {
	createInquery = async (
		name: string,
		email: string,
		phone: string,
		company: string,
		inqueryType: string,
		message: string,
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
				status,
			});

			return inquery ? inquery.toJSON() : null;
		} catch (err: any) {
			console.log(
				"Error occured while creating inquery: ".red,
				err.message,
			);
			throw err;
		}
	};

	addInqueryImage = async (
		imageName: string,
		inqueryId: number,
	): Promise<boolean> => {
		try {
			await InqueryImage.create({ imageName, inqueryId });
			return true;
		} catch (err: any) {
			console.error(
				"Error occurred while adding inquery image: ",
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

	openInquery = async (
		inqueryId: number,
	): Promise<Inquery | InqueryAttributes | null> => {
		try {
			const inquery = await Inquery.findOne({
				where: { inqueryId },
			});
			if (inquery) {
				inquery.status = "open";
				await inquery.save();
				return inquery.toJSON();
			}
			return null;
		} catch (err: any) {
			console.log(
				"Error occured while opening inquery: ".red,
				err.message,
			);
			throw err;
		}
	};

	deleteInquery = async (inqueryId: number): Promise<boolean> => {
		try {
			const inquery = await Inquery.findOne({ where: { inqueryId } });

			if (!inquery) return false;

			await InqueryImage.destroy({ where: { inqueryId } });
			await inquery.destroy();

			return true;
		} catch (err: any) {
			console.error(
				"Error occurred while deleting inquiry: ".red,
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
				include: [{ model: InqueryImage, as: "images" }],
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

	getInqueryById = async (
		inqueryId: number,
	): Promise<Inquery | InqueryAttributes | null> => {
		try {
			const inquery = await Inquery.findOne({
				where: { inqueryId },
				include: [{ model: InqueryImage, as: "images" }],
			});
			if (inquery) {
				return inquery.toJSON();
			}
			return null;
		} catch (err: any) {
			console.log(
				"Error occured while finding inquery by id: ".red,
				err.message,
			);
			throw err;
		}
	};
}

export default InqueryService;
