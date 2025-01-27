import AdminService from "@/service/admin.service";
import StaffService from "@/service/staff.service";
import CustomerService from "@/service/customer.service";
import { responseSender, verifyToken } from "@/util";
import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

class AuthMiddleware {
	constructor(
		private adminService = new AdminService(),
		private staffService = new StaffService(),
		private customerService = new CustomerService(),
	) {}

	authenticate = (
		roles: Array<"customer" | "admin" | "agent" | "designer">,
	) => {
		return async (req: Request, res: Response, next: NextFunction) => {
			try {
				const authHeader = req.headers["authorization"];

				if (!authHeader) {
					return responseSender(
						res,
						401,
						"Authorization token is missing.",
					);
				}

				const authToken = authHeader.split(" ")[1];
				if (!authToken) {
					return responseSender(
						res,
						401,
						"Authorization token is missing.",
					);
				}

				try {
					const decodedToken = verifyToken(authToken);

					if (!decodedToken) {
						return responseSender(
							res,
							403,
							"Invalid authorization token.",
						);
					}

					let user;

					for (let role of roles) {
						if (role === "customer") {
							user =
								await this.customerService.getCustomerByEmail(
									decodedToken.email,
								);
							if (user) {
								if (
									decodedToken.tokenVersion !==
									user.tokenVersion
								) {
									return responseSender(
										res,
										403,
										"Invalid authorization token.",
									);
								}
								(req as any).customer = decodedToken;
								break;
							}
						} else if (role === "admin") {
							user = await this.adminService.getAdminByEmail(
								decodedToken.email,
							);
							if (user) {
								if (
									decodedToken.tokenVersion !==
									user.tokenVersion
								) {
									return responseSender(
										res,
										403,
										"Invalid authorization token.",
									);
								}
								(req as any).admin = decodedToken;
								break;
							}
						} else if (role === "agent" || role === "designer") {
							user =
								await this.staffService.getStaffByEmailAndRole(
									decodedToken.email,
									role,
								);
							if (user) {
								if (
									decodedToken.tokenVersion !==
									user.tokenVersion
								) {
									return responseSender(
										res,
										403,
										"Invalid authorization token.",
									);
								}
								(req as any).staff = decodedToken;
								break;
							}
						}
					}

					if (!user) {
						return responseSender(
							res,
							403,
							"Invalid authorization token.",
						);
					}

					next();
				} catch (err: any) {
					console.log(
						"Error occured while verifying token: ".red,
						err.message,
					);
					if (err instanceof jwt.JsonWebTokenError) {
						return responseSender(
							res,
							403,
							"Invalid authorization token.",
						);
					}
					next(err);
				}
			} catch (err: any) {
				console.log(
					"Error occured in auth middleware: ".red,
					err.message,
				);
				next(err);
			}
		};
	};
}

export default AuthMiddleware;
