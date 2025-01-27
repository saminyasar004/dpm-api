import express from "express";
import cors, { CorsOptions } from "cors";
import morgan from "morgan";
import helmet from "helmet";
import compression from "compression";
import swaggerUi from "swagger-ui-express";
import swaggerSpecs from "@/config/swagger.config";

import {
	serverUrlPrefix,
	apiDocsUrl,
	apiWhitelistedDomains,
} from "@/config/dotenv.config";
import { responseSender } from "@/util";

import adminRouter from "@/routes/admin.route";
import notFoundController from "@/controller/notFound.controller";
import errorController from "@/controller/error.controller";
import staffRouter from "@/routes/staff.route";
import newsletterRouter from "@/routes/newsletter.route";
import inqueryRouter from "@/routes/inquery.route";
import customerRouter from "@/routes/customer.route";
import faqRouter from "@/routes/faq.route";

const app = express();

// const allowedOrigins = apiWhitelistedDomains;
// const corsOptions: CorsOptions = {
// 	origin: (origin, callback) => {
// 		if (!origin || allowedOrigins?.includes(origin)) {
// 			callback(null, true); // Allow the origin
// 		} else {
// 			callback(new Error("Not allowed by CORS")); // Reject the origin
// 		}
// 	},
// };

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use(cors(corsOptions));
app.use(cors());
app.use(compression());
app.use(helmet());

app.use(morgan("dev"));

app.use("/static", express.static("public"));

// Swagger UI setup
app.use(apiDocsUrl, swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

// health check
app.get(`${serverUrlPrefix}/health`, (req, res) => {
	responseSender(res, 200, "API is running.");
});

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

// 404 middleware
app.use(notFoundController);

// global error controller
app.use(errorController);

export default app;
