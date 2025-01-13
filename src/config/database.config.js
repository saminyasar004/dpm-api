const { Sequelize } = require("sequelize");
const {
	dbHost,
	dbName,
	dbUser,
	dbPassword,
	nodeEnv,
} = require("./dotenv.config");

const sequelize = new Sequelize(dbName, dbUser, dbPassword, {
	host: dbHost,
	dialect: "mysql",
	logging: false, // Set to true if you want to see SQL queries
	port: 3306,
	pool: {
		max: 10,
		min: 0,
		acquire: 30000,
		idle: 10000,
	},
	dialectOptions: {
		ssl: {
			rejectUnauthorized: nodeEnv === "production",
		},
	},
});

const initializeDatabase = async () => {
	try {
		await sequelize.authenticate();
		// Sync models after database creation
		await sequelize.sync({ alter: true });
		console.log("Database synced successfully!".green);
	} catch (error) {
		console.error("Error initializing database: ".red, error.message);
	}
};

module.exports = {
	sequelize,
	initializeDatabase,
};
