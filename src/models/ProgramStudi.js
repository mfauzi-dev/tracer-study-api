import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const ProgramStudi = sequelize.define(
    "ProgramStudi",
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false,
        },
        fakultasId: {
            type: DataTypes.INTEGER,
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

export default ProgramStudi;
