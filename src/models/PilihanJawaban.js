import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const PilihanJawaban = sequelize.define(
    "PilihanJawaban",
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        pertanyaanId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        name: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
    },
    {
        tableName: "pilihan_jawaban",
        timestamps: true,
        freezeTableName: true,
    }
);

export default PilihanJawaban;
