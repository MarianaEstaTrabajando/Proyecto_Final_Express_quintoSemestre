const { DataTypes } = require("sequelize");
const sequelize = require("../../database");

const GatosDatos = sequelize.define("vw_GatosDatos", {
  id: { type: DataTypes.INTEGER, primaryKey: true },
  nombre_gato: { type: DataTypes.STRING(100) },
  descripcion: { type: DataTypes.TEXT },
  temperamento: { type: DataTypes.STRING(200) },
  edad_gato: { type: DataTypes.INTEGER },
  raza: { type: DataTypes.STRING(100) },
  estado: { type: DataTypes.STRING(20) },
  refugio: { type: DataTypes.STRING(200) },
  medicinas: { type: DataTypes.TEXT },
  enfermedades: { type: DataTypes.TEXT },
  vacunas: { type: DataTypes.TEXT },
}, {
  tableName: "vw_GatosDatos",
  timestamps: false,
});

module.exports = GatosDatos;
