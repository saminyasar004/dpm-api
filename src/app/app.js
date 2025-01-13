const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const helmet = require("helmet");
const compression = require("compression");
const {
	serverUrlPrefix,
	apiDocsUrl,
	apiWhitelistedDomains,
} = require("../config/dotenv.config");
const { responseSender } = require("../util/index");
const notFoundController = require("../controller/notFound.controller");
const errorController = require("../controller/error.controller");
const userRouter = require("../routes/admin/user.route");

const swaggerUi = require("swagger-ui-express");
const swaggerSpecs = require("../config/swagger.config");

const app = express();

const corsOptions = {
	origin: (origin, callback) => {
		if (!origin || apiWhitelistedDomains.includes(origin)) {
			callback(null, true); // Allow request
		} else {
			callback(new Error("Not allowed by CORS")); // Block request
		}
	},
	optionsSuccessStatus: 200,
	credentials: true, // Allow cookies if needed
};

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors(corsOptions));
app.use(compression());
app.use(helmet());

app.use(morgan("dev"));

app.use("/static", express.static("public"));

// Swagger UI setup
app.use(apiDocsUrl, swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

// health check
app.get(`${serverUrlPrefix}/health`, (_req, res) => {
	responseSender(res, 200, "API is running.");
});

// user routes
app.use(`${serverUrlPrefix}/user`, userRouter);

// 404 middleware
app.use(notFoundController);

// global error controller
app.use(errorController);

module.exports = app;
