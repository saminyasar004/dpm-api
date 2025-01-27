import {
	Table,
	Column,
	Model,
	PrimaryKey,
	AutoIncrement,
	DataType,
	AllowNull,
} from "sequelize-typescript";

export interface AuditLogAttributes {
	auditId: number;
	auditedById: number;
	action: string;
	details: string;
	createdAt: Date;
	updatedAt: Date;
}

@Table({
	tableName: "AuditLogs",
	timestamps: true,
})
class AuditLog extends Model<AuditLogAttributes> {
	@PrimaryKey
	@AutoIncrement
	@Column(DataType.INTEGER)
	declare auditId: number;

	@AllowNull(false)
	@Column(DataType.INTEGER)
	declare auditedById: number;

	@AllowNull(false)
	@Column(DataType.STRING)
	declare action: string;

	@AllowNull(false)
	@Column(DataType.TEXT)
	declare details: string;
}

export default AuditLog;
