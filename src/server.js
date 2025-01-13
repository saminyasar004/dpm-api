require("colors");
const http = require("http");
const app = require("./app/app");
const url = require("url");
const { port, apiDocsUrl, serverBaseUrl } = require("./config/dotenv.config");
const { initializeDatabase } = require("./config/database.config");

const server = http.createServer(app);

(async () => {
	try {
		await initializeDatabase();
	} catch (err) {
		console.error("Unable to connect to the database: ".red, err.message);
	} finally {
		try {
			server.listen(port, () => {
				console.log(`Server is running on ${serverBaseUrl}`.yellow);
				console.log(
					`API Docs: ${url.resolve(serverBaseUrl, apiDocsUrl)}`.blue
				);
			});
		} catch (err) {
			console.log("Error occured starting the server: ".red, err.message);
		}
	}
})();
