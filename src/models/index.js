import Biodata from "./Biodata.js";
import Fakultas from "./Fakultas.js";
import JawabanKuesioner from "./JawabanKuesioner.js";
import Kota from "./Kota.js";
import LokasiPekerjaan from "./LokasiPekerjaan.js";
import Pertanyaan from "./Pertanyaan.js";
import PilihanJawaban from "./PilihanJawaban.js";
import ProgramStudi from "./ProgramStudi.js";
import Provinsi from "./Provinsi.js";
import User from "./User.js";

// User
User.belongsTo(Fakultas, { foreignKey: "fakultasId", onDelete: "CASCADE" });
User.belongsTo(ProgramStudi, {
    foreignKey: "programStudiId",
    onDelete: "CASCADE",
});
User.hasOne(Biodata, { foreignKey: "userId", as: "biodata" });
User.hasMany(JawabanKuesioner, {
    foreignKey: "userId",
    as: "user_kuesioner",
});
User.hasMany(LokasiPekerjaan, { foreignKey: "user_id" });

// Fakultas
Fakultas.hasMany(User, { foreignKey: "fakultasId" });
Fakultas.hasMany(ProgramStudi, { foreignKey: "fakultasId" });
Fakultas.hasMany(Biodata, { foreignKey: "fakultasId" });
Fakultas.hasMany(LokasiPekerjaan, { foreignKey: "fakultas_id" });

// ProgramStudi
ProgramStudi.hasMany(User, { foreignKey: "programStudiId" });
ProgramStudi.belongsTo(Fakultas, {
    foreignKey: "fakultasId",
    onDelete: "CASCADE",
    as: "fakultas",
});
ProgramStudi.hasMany(Biodata, { foreignKey: "programStudiId" });
ProgramStudi.hasMany(LokasiPekerjaan, { foreignKey: "program_studi_id" });

// Biodata
Biodata.belongsTo(User, { foreignKey: "userId", onDelete: "CASCADE" });
Biodata.belongsTo(Fakultas, { foreignKey: "fakultasId", onDelete: "CASCADE" });
Biodata.belongsTo(ProgramStudi, {
    foreignKey: "programStudiId",
    onDelete: "CASCADE",
});

// Pertanyaan
Pertanyaan.hasMany(PilihanJawaban, {
    foreignKey: "pertanyaanId",
    as: "pilihan_jawaban",
});
Pertanyaan.hasMany(JawabanKuesioner, {
    foreignKey: "pertanyaanId",
    as: "pertanyaan_kuesioner",
});

// PilihanJawaban
PilihanJawaban.belongsTo(Pertanyaan, {
    foreignKey: "pertanyaanId",
    as: "pertanyaan",
    onDelete: "CASCADE",
});
PilihanJawaban.hasMany(JawabanKuesioner, {
    foreignKey: "pilihanJawabanId",
    as: "pilihanJawaban_kuesioner",
});

JawabanKuesioner.belongsTo(User, {
    foreignKey: "userId",
    as: "kuesioner_user",
    onDelete: "CASCADE",
});
JawabanKuesioner.belongsTo(Pertanyaan, {
    foreignKey: "pertanyaanId",
    as: "kuesioner_pertanyaan",
    onDelete: "CASCADE",
});
JawabanKuesioner.belongsTo(PilihanJawaban, {
    foreignKey: "pilihanJawabanId",
    as: "kuesioner_pilihanJawaban",
    onDelete: "CASCADE",
});

Provinsi.hasMany(Kota, { foreignKey: "provinsi_id" });
Provinsi.hasMany(LokasiPekerjaan, { foreignKey: "provinsi_id" });

Kota.belongsTo(Provinsi, { foreignKey: "provinsi_id" });
Kota.hasMany(LokasiPekerjaan, { foreignKey: "kota_id" });

LokasiPekerjaan.belongsTo(User, { foreignKey: "user_id", onDelete: "CASCADE" });
LokasiPekerjaan.belongsTo(Provinsi, {
    foreignKey: "provinsi_id",
    onDelete: "CASCADE",
});
LokasiPekerjaan.belongsTo(Kota, { foreignKey: "kota_id", onDelete: "CASCADE" });
LokasiPekerjaan.belongsTo(Fakultas, {
    foreignKey: "fakultas_id",
    onDelete: "CASCADE",
});
LokasiPekerjaan.belongsTo(ProgramStudi, {
    foreignKey: "program_studi_id",
    onDelete: "CASCADE",
});

export {
    User,
    Fakultas,
    ProgramStudi,
    Biodata,
    Pertanyaan,
    PilihanJawaban,
    JawabanKuesioner,
    Provinsi,
    Kota,
    LokasiPekerjaan,
};
