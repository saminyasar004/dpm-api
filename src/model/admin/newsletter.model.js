const { sequelize } = require("../../config/database.config");
const { DataTypes } = require("sequelize");

// Define the User model
const Newsletter = sequelize.define(
	"Newsletter",
	{
		newsletter_id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},
		email: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		is_verified: {
			type: DataTypes.BOOLEAN,
			allowNull: false,
		},
		verification_token: {
			type: DataTypes.STRING,
			allowNull: false,
		},
	},
	{
		timestamps: true,
		createdAt: "created_at",
		updatedAt: "updated_at",
	}
);

module.exports = Newsletter;
