import "tsconfig-paths/register";
import "colors";
import http from "http";
import app from "@/app/app";
import urlJoin from "url-join";
import { port, apiDocsUrl, serverBaseUrl } from "@/config/dotenv.config";
import { initializeDatabase, sequelize } from "@/config/database.config";

const server = http.createServer(app);

const initializeServer = async (): Promise<void> => {
	try {
		await initializeDatabase();
		try {
			server.listen(port, () => {
				console.log(`Server is running on ${serverBaseUrl}`.yellow);
				console.log(
					`API Docs: ${urlJoin(serverBaseUrl, apiDocsUrl)}`.blue,
				);
			});
		} catch (err: any) {
			console.log("Error occured starting the server: ".red, err.message);
		}
	} catch (err: any) {
		console.error("Unable to connect to the database: ".red, err.message);
	}
};

initializeServer();

export default initializeServer;
