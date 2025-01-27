import {
	responseSender,
	hashedPassword,
	comparePassword,
	generateJWTToken,
} from "@/util";
import { Request, Response, NextFunction } from "express";
import AdminService from "@/service/admin.service";
import fs from "fs";
import path from "path";

class AdminController {
	private adminService: AdminService;

	constructor() {
		this.adminService = new AdminService();
	}

	registerAdmin = async (req: Request, res: Response, next: NextFunction) => {
		try {
			const admin = {
				name: (req as any).validatedValue.name,
				email: (req as any).validatedValue.email,
				password: await hashedPassword(
					(req as any).validatedValue.password,
				),
			};

			// check if the there is already an admin registered
			const isAdminExists = await this.adminService.getAllAdmin();
			if (isAdminExists && isAdminExists.length > 0) {
				return responseSender(
					res,
					400,
					"Admin already exists. Please login.",
				);
			}

			const createdAdmin = await this.adminService.registerAdmin(
				admin.name,
				admin.email,
				admin.password,
			);
			if (!createdAdmin) {
				return responseSender(
					res,
					400,
					"Admin registration failed. Please try again.",
				);
			}
			// create jwt token
			const { password, ...authTokenPayload } = createdAdmin;
			const authToken = generateJWTToken(authTokenPayload);

			return responseSender(res, 201, "Admin registered successfully.", {
				admin: authTokenPayload,
				authToken,
			});
		} catch (err: any) {
			console.log("Error occured in admin controller: ".red, err.message);
			next(err);
		}
	};

	loginAdmin = async (req: Request, res: Response, next: NextFunction) => {
		try {
			const fetchedAdmin = await this.adminService.getAdminByEmail(
				(req as any).validatedValue.email,
			);
			if (!fetchedAdmin) {
				return responseSender(
					res,
					400,
					"Admin not found. Please register.",
				);
			}
			const isPasswordValid = await comparePassword(
				(req as any).validatedValue.password,
				fetchedAdmin.password,
			);
			if (!isPasswordValid) {
				return responseSender(
					res,
					400,
					"Invalid password. Please try again.",
				);
			}
			// create jwt token
			const { password, ...authTokenPayload } = fetchedAdmin;
			const authToken = generateJWTToken(authTokenPayload);

			return responseSender(res, 200, "Admin logged in successfully.", {
				admin: authTokenPayload,
				authToken,
			});
		} catch (err: any) {
			console.log("Error occured in admin controller: ".red, err.message);
			next(err);
		}
	};

	uploadAdminAvatar = async (
		req: Request,
		res: Response,
		next: NextFunction,
	) => {
		try {
			const fileValidationError = (req as any).fileValidationError;
			if (fileValidationError) {
				return responseSender(res, 400, fileValidationError);
			}

			const authorizedAdmin = (req as any).admin;

			const fetchedAdmin = await this.adminService.getAdminByEmail(
				authorizedAdmin.email,
			);

			if (req.file && fetchedAdmin && fetchedAdmin.avatar !== "null") {
				const previousAvatar = path.join(
					req.file.destination,
					fetchedAdmin.avatar,
				);
				fs.unlink(previousAvatar, (unlinkErr) => {
					if (unlinkErr) {
						console.log(
							"Error deleting previous avatar: ".red,
							unlinkErr.message,
						);
						throw unlinkErr;
					}
				});
			}

			const avatarPath = (req.file && req.file.filename) || "null";

			const admin = await this.adminService.uploadAdminAvatar(
				authorizedAdmin?.adminId,
				avatarPath,
			);
			if (!admin) {
				return responseSender(
					res,
					400,
					"Admin avatar upload failed. Please try again.",
				);
			}

			return responseSender(
				res,
				200,
				"Admin avatar uploaded successfully.",
			);
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

			console.log("Error occured in admin controller: ".red, err.message);
			next(err);
		}
	};

	updateAdmin = async (req: Request, res: Response, next: NextFunction) => {
		try {
			const authorizedAdmin = (req as any).admin;
			console.log(authorizedAdmin);

			const fetchedAdmin = await this.adminService.getAdminByEmail(
				authorizedAdmin?.email,
			);
			if (!fetchedAdmin) {
				return responseSender(
					res,
					400,
					"Admin not found. Please register.",
				);
			}
			const isPasswordValid = await comparePassword(
				(req as any).validatedValue.currentPassword,
				fetchedAdmin.password,
			);
			if (!isPasswordValid) {
				return responseSender(
					res,
					400,
					"Invalid password. Please try again.",
				);
			}

			const isUpdated = await this.adminService.updateAdmin(
				fetchedAdmin.email,
				(req as any).validatedValue.name,
				await hashedPassword((req as any).validatedValue.newPassword),
			);
			if (!isUpdated) {
				return responseSender(res, 400, "Admin update failed.");
			}

			return responseSender(res, 200, "Admin updated successfully.");
		} catch (err: any) {
			console.log("Error occured in admin controller: ".red, err.message);
			next(err);
		}
	};
}

export default AdminController;
