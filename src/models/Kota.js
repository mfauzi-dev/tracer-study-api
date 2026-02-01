import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Kota = sequelize.define(
    "Kota",
    {
        id: {
            type: DataTypes.STRING,
            primaryKey: true,
        },
        provinsi_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
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

export default Kota;
