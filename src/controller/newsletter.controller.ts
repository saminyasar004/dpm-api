import NewsletterService from "@/service/newsletter.service";
import { responseSender, generateVerificationToken } from "@/util";
import urlJoin from "url-join";
import { Op, Order, WhereOptions } from "sequelize";
import { serverBaseUrl, serverUrlPrefix } from "@/config/dotenv.config";
import { Request, Response, NextFunction } from "express";
import { NewsletterAttributes } from "@/model/newsletter.model";

class NewsletterController {
	private newsletterService: NewsletterService;
	constructor() {
		this.newsletterService = new NewsletterService();
	}

	subscribe = async (req: Request, res: Response, next: NextFunction) => {
		try {
			const email = (req as any).validatedValue.email;

			const isEmailExists =
				await this.newsletterService.findByEmail(email);
			if (isEmailExists) {
				return responseSender(res, 400, "You have already subscribed.");
			}

			const verificationToken = generateVerificationToken();
			const newsletter = await this.newsletterService.subscribe(
				email,
				verificationToken,
			);
			if (!newsletter) {
				return responseSender(
					res,
					500,
					"Something went wrong. Please try again.",
				);
			}
			const verificationUrl = urlJoin(
				serverBaseUrl,
				serverUrlPrefix,
				`/newsletter/verify?email=${email}&token=${verificationToken}`,
			);
			const unsubscribeUrl = urlJoin(
				serverBaseUrl,
				serverUrlPrefix,
				`/newsletter/unsubscribe?email=${email}&token=${verificationToken}`,
			);
			return responseSender(
				res,
				200,
				"You have subscribed successfully.",
				{
					verificationUrl,
					unsubscribeUrl,
				},
			);
		} catch (err: any) {
			console.log(
				"Error occured while subscribing newsletter: ".red,
				err.message,
			);
			next(err);
		}
	};

	verifyEmail = async (req: Request, res: Response, next: NextFunction) => {
		try {
			const email = (req as any).validatedValue.email;
			const verificationToken = (req as any).validatedValue.token;

			const isEmailExists =
				await this.newsletterService.findByEmail(email);
			if (!isEmailExists) {
				return responseSender(res, 400, "You have not subscribed.");
			}

			const isVerified = await this.newsletterService.verifyEmail(
				email,
				verificationToken,
			);
			if (isVerified) {
				return responseSender(res, 200, "You have verified email.");
			}
			return responseSender(res, 400, "Invalid token. Please try again.");
		} catch (err: any) {
			console.log(
				"Error occured while verifying email: ".red,
				err.message,
			);
			next(err);
		}
	};

	unsubscribe = async (req: Request, res: Response, next: NextFunction) => {
		try {
			const email = (req as any).validatedValue.email;
			const verificationToken = (req as any).validatedValue.token;

			const isEmailExists =
				await this.newsletterService.findByEmail(email);
			if (!isEmailExists) {
				return responseSender(res, 400, "You have not subscribed.");
			}

			const isUnsubscribed = await this.newsletterService.unsubscribe(
				email,
				verificationToken,
			);
			if (!isUnsubscribed) {
				return responseSender(
					res,
					400,
					"Invalid token. Please try again.",
				);
			}
			return responseSender(
				res,
				200,
				"You have unsubscribed successfully.",
			);
		} catch (err: any) {
			console.log(
				"Error occured while unsubscribing newsletter: ".red,
				err.message,
			);
			next(err);
		}
	};

	getAllSubscriber = async (
		req: Request,
		res: Response,
		next: NextFunction,
	) => {
		try {
			const searchTerm = (req as any).validatedValue?.searchTerm;
			const searchBy = (req as any).validatedValue?.searchBy;
			const verified = (req as any).validatedValue?.verified;
			const currentPage = parseInt(
				(req as any).validatedValue?.page || 1,
			);
			const limitPerPage = parseInt(
				(req as any).validatedValue?.limit || 20,
			);
			const offset = (currentPage - 1) * limitPerPage;
			const order: Order = [["createdAt", "DESC"]];
			const filter: WhereOptions<NewsletterAttributes> = {};

			if (verified) {
				filter.verified = verified;
			}
			if (searchTerm && searchBy) {
				switch (searchBy) {
					case "email":
						filter.email = {
							[Op.like]: `%${searchTerm}%`,
						};
						break;
				}
			}

			const subscribers = await this.newsletterService.getAll(
				filter,
				limitPerPage,
				offset,
				order,
			);
			if (!subscribers) {
				return responseSender(res, 400, "No subscribers found.");
			}

			subscribers.forEach((subscriber) => {
				(subscriber as any).verificationUrl = urlJoin(
					serverBaseUrl,
					serverUrlPrefix,
					`/newsletter/verify?email=${subscriber.email}&token=${subscriber.verificationToken}`,
				);
				(subscriber as any).unsubscribeUrl = urlJoin(
					serverBaseUrl,
					serverUrlPrefix,
					`/newsletter/unsubscribe?email=${subscriber.email}&token=${subscriber.verificationToken}`,
				);
			});

			return responseSender(
				res,
				200,
				"Subscribers fetched successfully.",
				{
					subscribers,
				},
			);
		} catch (err: any) {
			console.log(
				"Error occured while getting all subscribers: ".red,
				err.message,
			);
			next(err);
		}
	};
}

export default NewsletterController;
