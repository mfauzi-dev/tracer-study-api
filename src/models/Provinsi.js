import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Provinsi = sequelize.define(
    "Provinsi",
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    },
    {
        timestamps: true,
        freezeTableName: true,
    }
);

export default Provinsi;
