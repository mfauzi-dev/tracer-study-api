import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Fakultas = sequelize.define(
    "Fakultas",
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
    },
    {
        timestamps: true,
        freezeTableName: true,
    }
);

export default Fakultas;
