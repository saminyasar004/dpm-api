const { Sequelize } = require("sequelize");

const { dbName, dbUser, dbPassword } = require("./config/dotenv.config");

const sequelize = new Sequelize("", dbUser, dbPassword, {
	host: "localhost",
	dialect: "mysql",
	logging: false,
});

(async () => {
	try {
		const dbExistQueryResult = await sequelize.query(
			`SHOW DATABASES LIKE '${dbName}'`
		);

		try {
			if (dbExistQueryResult[0].length === 0) {
				await sequelize.query(`CREATE DATABASE ${dbName}`);
			}
		} catch (err) {
			console.log("Error occuresd creating database: ", err.message);
		}
	} catch (err) {
		console.log(
			"Error occuresd checking database existence: ",
			err.message
		);
		return false;
	} finally {
		console.log(`Database '${dbName}' created successfully!`);
		sequelize.close();
	}
})();
