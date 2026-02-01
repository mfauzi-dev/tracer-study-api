import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const LokasiPekerjaan = sequelize.define(
    "LokasiPekerjaan",
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: "user",
                key: "id",
            },
            onDelete: "CASCADE",
        },
        provinsi_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        kota_id: {
            type: DataTypes.STRING,
            allowNull: false,
            references: {
                model: "kota",
                key: "id",
            },
            onDelete: "CASCADE",
        },
        fakultas_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        program_studi_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        company_name: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        company_address: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        job_title: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        domisili_address: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        longitude: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        latitude: {
            type: DataTypes.STRING,
            allowNull: true,
        },
    },
    {
        tableName: "lokasi_pekerjaan",
        timestamps: true,
        freezeTableName: true,
    }
);

export default LokasiPekerjaan;
