const { sequelize } = require("../../config/database.config");
const { DataTypes } = require("sequelize");

// Define the User model
const User = sequelize.define(
	"User",
	{
		user_id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},
		name: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		email: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		password: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		role: {
			type: DataTypes.ENUM,
			values: ["owner", "agent", "designer"],
			defaultValue: "agent",
			allowNull: false,
		},
		avatar: {
			type: DataTypes.STRING, // Stores the file path or URL of the avatar
			allowNull: false, // Optional field
		},
	},
	{
		timestamps: true,
		createdAt: "created_at",
		updatedAt: "updated_at",
	}
);

module.exports = User;
