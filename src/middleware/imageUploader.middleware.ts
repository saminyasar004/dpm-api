import multer from "multer";
import path from "path";
import fs from "fs";
import sharp from "sharp";
import { v4 as uuid } from "uuid";
import { responseSender } from "@/util";
import { Request, Response, NextFunction } from "express";

class ImageUploaderMiddleware {
	uploader = (folderName: string) => {
		const uploadDir = path.join(__dirname, `../../public/${folderName}/`);

		// Set up storage
		const storage = multer.diskStorage({
			destination: async (req, file, cb: any) => {
				try {
					const isUploadDirExists = fs.existsSync(uploadDir);
					if (!isUploadDirExists) {
						fs.mkdirSync(uploadDir, { recursive: true });
					}
					cb(null, uploadDir);
				} catch (err: any) {
					console.log(
						"Error occured in image uploader middleware: ".red,
						err.message,
					);
					(req as any).fileValidationError =
						"Could not create the uploads directory!";
					cb(null, false);
				}
			},
			filename: (req, file, cb: any) => {
				try {
					const uniqueSuffix = uuid().toString().replace(/-/gi, "");
					cb(null, uniqueSuffix + path.extname(file.originalname)); // Append unique timestamp
				} catch (err: any) {
					console.log(
						"Error occured in image uploader middleware: ".red,
						err.message,
					);
					(req as any).fileValidationError = err.message;
					cb(null, false);
				}
			},
		});

		// File filter to allow only image files
		const fileFilter = (req: any, file: any, cb: any) => {
			if (file.mimetype.startsWith("image/")) {
				cb(null, true);
			} else {
				(req as any).fileValidationError =
					"Only image files are allowed.";
				cb(null, false);
			}
		};

		return multer({
			storage,
			fileFilter,
			limits: { fileSize: 20 * 1024 * 1024 }, // 20MB max file size
		});
	};

	compressImage = async (req: Request, res: Response, next: NextFunction) => {
		try {
			if (!req.file || (req as any).fileValidationError) {
				// return responseSender(
				// 	res,
				// 	400,
				// 	(req as any).fileValidationError ||
				// 		"No file uploaded.",
				// );
				return next();
			}

			const filePath = req.file.path;
			const compressedPath = filePath.replace(
				/(\.\w+)$/,
				`-${Math.ceil(Math.random() * 100000)}$1`,
			);

			try {
				await sharp(filePath)
					.resize({ width: 1000 })
					.jpeg({ quality: 80 })
					.toFile(compressedPath);

				// Replace the original file path with the compressed file path
				fs.unlinkSync(filePath); // Remove the uncompressed file
				req.file.path = compressedPath;
				req.file.filename = path.basename(compressedPath);

				next();
			} catch (err: any) {
				console.log("Error compressing image: ".red, err.message);
				next(err);
			}
		} catch (err) {
			next(err);
		}
	};
}

export default ImageUploaderMiddleware;
