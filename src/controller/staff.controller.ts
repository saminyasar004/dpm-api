import StaffService from "@/service/staff.service";
import fs from "fs";
import path from "path";
import {
	responseSender,
	hashedPassword,
	comparePassword,
	generateJWTToken,
} from "@/util";
import { Request, Response, NextFunction } from "express-serve-static-core";

class StaffController {
	private staffService: StaffService;

	constructor() {
		this.staffService = new StaffService();
	}

	registerStaff = async (req: Request, res: Response, next: NextFunction) => {
		try {
			const staff = {
				name: (req as any).validatedValue.name,
				email: (req as any).validatedValue.email,
				password: await hashedPassword(
					(req as any).validatedValue.password,
				),
				role: (req as any).validatedValue.role,
				commissionPercentage: (req as any).validatedValue
					.commissionPercentage,
			};

			// check if the email is already registered
			const isEmailExists = await this.staffService.getStaffByEmail(
				staff.email,
			);
			if (isEmailExists) {
				return responseSender(
					res,
					400,
					`${staff.email} is already registered as ${isEmailExists.role}. Please login.`,
				);
			}

			const createdStaff = await this.staffService.registerStaff(
				staff.name,
				staff.email,
				staff.password,
				staff.role,
				staff.commissionPercentage,
			);
			if (!createdStaff) {
				return responseSender(
					res,
					400,
					"Staff registration failed. Please try again.",
				);
			}
			// create jwt token
			const { password, ...authTokenPayload } = createdStaff;
			const authToken = generateJWTToken(authTokenPayload);

			return responseSender(res, 201, "Staff registered successfully.", {
				staff: authTokenPayload,
				authToken,
			});
		} catch (err: any) {
			console.log("Error occured in staff controller: ".red, err.message);
			next(err);
		}
	};

	loginStaff = async (req: Request, res: Response, next: NextFunction) => {
		try {
			const fetchedStaff = await this.staffService.getStaffByEmail(
				(req as any).validatedValue.email,
			);
			if (!fetchedStaff) {
				return responseSender(
					res,
					400,
					"Staff not found. Please register.",
				);
			}
			const isPasswordValid = await comparePassword(
				(req as any).validatedValue.password,
				fetchedStaff.password,
			);
			if (!isPasswordValid) {
				return responseSender(
					res,
					400,
					"Invalid password. Please try again.",
				);
			}
			// create jwt token
			const { password, ...authTokenPayload } = fetchedStaff;
			const authToken = generateJWTToken(authTokenPayload);

			return responseSender(res, 200, "Staff logged in successfully.", {
				staff: authTokenPayload,
				authToken,
			});
		} catch (err: any) {
			console.log("Error occured in staff controller: ".red, err.message);
			next(err);
		}
	};

	uploadStaffAvatar = async (
		req: Request,
		res: Response,
		next: NextFunction,
	) => {
		try {
			const fileValidationError = (req as any).fileValidationError;
			if (fileValidationError) {
				return responseSender(res, 400, fileValidationError);
			}

			const authorizedStaff = (req as any).staff;

			const fetchedStaff = await this.staffService.getStaffByEmail(
				authorizedStaff.email,
			);

			if (!fetchedStaff) {
				return responseSender(
					res,
					400,
					"Staff not found. Please register.",
				);
			}

			if (fetchedStaff.avatar !== "null" && req.file?.destination) {
				const previousAvatar = path.join(
					req.file?.destination,
					fetchedStaff.avatar,
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

			const avatarPath =
				(req.file?.filename && req.file.filename) || "null";

			const staff = await this.staffService.uploadStaffAvatar(
				authorizedStaff.staffId,
				avatarPath,
			);

			if (!staff) {
				return responseSender(
					res,
					400,
					"Staff avatar upload failed. Please try again.",
				);
			}

			return responseSender(
				res,
				200,
				"Staff avatar uploaded successfully.",
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

			console.log("Error occured in staff controller: ".red, err.message);
			next(err);
		}
	};

	updateStaff = async (req: Request, res: Response, next: NextFunction) => {
		try {
			const authorizedStaff = (req as any).user;

			const fetchedStaff = await this.staffService.getStaffByEmail(
				authorizedStaff.email,
			);
			if (!fetchedStaff) {
				return responseSender(
					res,
					400,
					"Staff not found. Please register.",
				);
			}
			const isPasswordValid = await comparePassword(
				(req as any).validatedValue.currentPassword,
				fetchedStaff.password,
			);
			if (!isPasswordValid) {
				return responseSender(
					res,
					400,
					"Invalid password. Please try again.",
				);
			}

			const staff = await this.staffService.updateStaff(
				(req as any).validatedValue.name,
				authorizedStaff.email,
				await hashedPassword((req as any).validatedValue.newPassword),
				(req as any).validatedValue.role,
				(req as any).validatedValue.commissionPercentagePerOrder,
			);
			if (!staff) {
				return responseSender(
					res,
					400,
					"Staff update failed. Please try again.",
				);
			}
			return responseSender(res, 200, "Staff updated successfully.");
		} catch (err: any) {
			console.log("Error occured in staff controller: ".red, err.message);
			next(err);
		}
	};
}

export default StaffController;
