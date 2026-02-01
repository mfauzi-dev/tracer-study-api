import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const JawabanKuesioner = sequelize.define(
    "JawabanKuesioner",
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        pertanyaanId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        pilihanJawabanId: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        jawaban_teks: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        tahun_akademik: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    },
    {
        tableName: "jawaban_kuesioner",
        timestamps: true,
        freezeTableName: true,
    }
);

export default JawabanKuesioner;
