const multer = require("multer");
const path = require("path");
const fs = require("fs");
const sharp = require("sharp");
const { v4: uuid } = require("uuid");
const { responseSender } = require("../../util");

const imageUploaderMiddleware = {};

imageUploaderMiddleware.uploader = (folderName) => {
	const uploadDir = path.join(__dirname, `../../../public/${folderName}/`);

	// Set up storage
	const storage = multer.diskStorage({
		destination: async (req, file, cb) => {
			try {
				const isUploadDirExists = fs.existsSync(uploadDir);
				if (!isUploadDirExists) {
					fs.mkdirSync(uploadDir, { recursive: true });
				}
				cb(null, uploadDir);
			} catch (error) {
				console.log(
					"Error occured in image uploader middleware: ".red,
					error.message
				);
				req.fileValidationError =
					"Could not create the uploads directory!";
				cb(null, false);
			}
		},
		filename: (req, file, cb) => {
			try {
				const uniqueSuffix = uuid().toString().replace(/-/gi, "");
				cb(null, uniqueSuffix + path.extname(file.originalname)); // Append unique timestamp
			} catch (err) {
				console.log(
					"Error occured in image uploader middleware: ".red,
					err.message
				);
				req.fileValidationError = err.message;
				cb(null, false);
			}
		},
	});

	// File filter to allow only image files
	const fileFilter = (req, file, cb) => {
		if (file.mimetype.startsWith("image/")) {
			cb(null, true);
		} else {
			req.fileValidationError = "Only image files are allowed.";
			cb(null, false);
		}
	};

	return multer({
		storage,
		fileFilter,
		limits: { fileSize: 20 * 1024 * 1024 }, // 20MB max file size
	});
};

// Compression middleware
imageUploaderMiddleware.compressImage = async (req, res, next) => {
	try {
		if (!req.file || req.fileValidationError) {
			return responseSender(
				res,
				400,
				req.fileValidationError ||
					"No file uploaded. Avatar is required."
			);
		}

		const filePath = req.file.path;
		const compressedPath = filePath.replace(
			/(\.\w+)$/,
			`-${Math.ceil(Math.random() * 100000)}$1`
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
		} catch (err) {
			console.log("Error compressing image: ".red, err.message);
			next(err);
		}
	} catch (err) {
		next(err);
	}
};

module.exports = imageUploaderMiddleware;
