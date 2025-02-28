import express from "express";
import cors, { CorsOptions } from "cors";
import morgan from "morgan";
import helmet from "helmet";
import compression from "compression";
import swaggerUi from "swagger-ui-express";
import swaggerSpecs from "../config/swagger.config";

import {
	serverUrlPrefix,
	apiDocsUrl,
	apiWhitelistedDomains,
} from "../config/dotenv.config";
import { responseSender } from "../util";

import adminRouter from "../routes/admin.route";
import notFoundController from "../controller/notFound.controller";
import errorController from "../controller/error.controller";
import staffRouter from "../routes/staff.route";
import newsletterRouter from "../routes/newsletter.route";
import inqueryRouter from "../routes/inquery.route";
import customerRouter from "../routes/customer.route";
import faqRouter from "../routes/faq.route";
import authRouter from "../routes/auth.route";
import productCategoryRouter from "../routes/product-category.route";
import productVariationRouter from "../routes/product-variation.route";
import productRouter from "../routes/product.route";
import productReviewRouter from "../routes/product-review.route";
import couponRouter from "../routes/coupon.route";
import orderRouter from "../routes/order.route";

const app = express();

export const allowedOrigins = apiWhitelistedDomains;
export const corsOptions: CorsOptions = {
	origin: (origin, callback) => {
		if (!origin || allowedOrigins?.includes(origin)) {
			callback(null, true); // Allow the origin
		} else {
			callback(new Error("Not allowed by CORS")); // Reject the origin
		}
	},
	methods: ["GET", "POST", "PUT", "DELETE"],
	credentials: true,
};

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors(corsOptions));
app.use(compression());
app.use(helmet());

app.use(morgan("dev"));

app.use("/static", (req, res, next) => {
	res.setHeader("Access-Control-Allow-Origin", "*");
	res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
	res.setHeader("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS");
	res.setHeader("Access-Control-Allow-Headers", "Content-Type");
	res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
	res.setHeader("Content-Disposition", "inline"); // Ensure correct file handling
	next();
});

app.use("/static", express.static("public"));

// Swagger UI setup
app.use(apiDocsUrl, swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

// ping route to check the api heartbeat
app.get(`${serverUrlPrefix}/`, (req, res) => {
	responseSender(res, 200, "OK");
});

// health check
app.get(`${serverUrlPrefix}/health`, (req, res) => {
	responseSender(res, 200, "API is running.");
});

// restrict disallowed origin request
// app.use((req, res, next) => {
// 	const origin = req.get("Origin");

// 	// Allow health check route
// 	if (req.path === `${serverUrlPrefix}/health`) {
// 		return next();
// 	}

// 	// Block requests without an Origin header or with an invalid Origin
// 	if (!origin || !allowedOrigins.includes(origin)) {
// 		return responseSender(res, 403, "Access forbidden");
// 	}

// 	next();
// });

// auth routes
app.use(`${serverUrlPrefix}/auth`, authRouter);

// admin routes
app.use(`${serverUrlPrefix}/admin`, adminRouter);

// staff routes
app.use(`${serverUrlPrefix}/staff`, staffRouter);

// newsletter routes
app.use(`${serverUrlPrefix}/newsletter`, newsletterRouter);

// inquery routes
app.use(`${serverUrlPrefix}/inquery`, inqueryRouter);

// customer routes
app.use(`${serverUrlPrefix}/customer`, customerRouter);

// faq routes
app.use(`${serverUrlPrefix}/faq`, faqRouter);

// product category routes
app.use(`${serverUrlPrefix}/product-category`, productCategoryRouter);

// product variation routes
app.use(`${serverUrlPrefix}/product-variation`, productVariationRouter);

// product review routes
app.use(`${serverUrlPrefix}/product-review`, productReviewRouter);

// coupon routes
app.use(`${serverUrlPrefix}/coupon`, couponRouter);

// product routes
app.use(`${serverUrlPrefix}/product`, productRouter);

// order routes
app.use(`${serverUrlPrefix}/order`, orderRouter);

// 404 middleware
app.use(notFoundController);

// global error controller
app.use(errorController);

export default app;
