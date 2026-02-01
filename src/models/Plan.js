import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Plan = sequelize.define(
    "Plan",
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        year: { type: DataTypes.INTEGER, allowNull: false },
        block: { type: DataTypes.STRING, allowNull: false },
        unit: { type: DataTypes.ENUM("m2", "Ton"), allowNull: false },
        jan: { type: DataTypes.FLOAT, defaultValue: 0 },
        feb: { type: DataTypes.FLOAT, defaultValue: 0 },
        mar: { type: DataTypes.FLOAT, defaultValue: 0 },
        apr: { type: DataTypes.FLOAT, defaultValue: 0 },
        mei: { type: DataTypes.FLOAT, defaultValue: 0 },
        jun: { type: DataTypes.FLOAT, defaultValue: 0 },
        jul: { type: DataTypes.FLOAT, defaultValue: 0 },
        ags: { type: DataTypes.FLOAT, defaultValue: 0 },
        sep: { type: DataTypes.FLOAT, defaultValue: 0 },
        okt: { type: DataTypes.FLOAT, defaultValue: 0 },
        nov: { type: DataTypes.FLOAT, defaultValue: 0 },
        des: { type: DataTypes.FLOAT, defaultValue: 0 },
        total: { type: DataTypes.FLOAT, defaultValue: 0 },
        yearTotal: { type: DataTypes.FLOAT, defaultValue: 0 },
        recovery: { type: DataTypes.FLOAT, defaultValue: 0 },
    },
    {
        tableName: "plans",
        timestamps: true,
        indexes: [
            {
                unique: true,
                fields: ["year", "block", "unit"], // ini yang penting banget
            },
        ],
    }
);

export default Plan;
