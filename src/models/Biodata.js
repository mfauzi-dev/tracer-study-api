import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Biodata = sequelize.define(
    "Biodata",
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false,
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        fakultasId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        programStudiId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        npm: {
            type: DataTypes.STRING(191),
            allowNull: true,
        },
        image: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        name: {
            type: DataTypes.STRING(191),
            allowNull: false,
        },
        tempatLahir: {
            type: DataTypes.STRING(191),
            allowNull: true,
        },
        tanggalLahir: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        alamat: {
            type: DataTypes.STRING(191),
            allowNull: true,
        },
        telepon: {
            type: DataTypes.STRING(191),
            allowNull: true,
        },
        jenisKelamin: {
            type: DataTypes.STRING(191),
            allowNull: true,
        },
        namaGelar: {
            type: DataTypes.STRING(191),
            allowNull: true,
        },
        ipk: {
            type: DataTypes.STRING(191),
            allowNull: true,
        },
        angkatan: {
            type: DataTypes.STRING(191),
            allowNull: true,
        },
    },
    {
        timestamps: true,
        freezeTableName: true,
    }
);

export default Biodata;
