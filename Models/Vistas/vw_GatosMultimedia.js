const { DataTypes, INTEGER } = require("sequelize");
const sequelize = require("../../database");

const GatosDatos = sequelize.define("vw_GatosMultimedia", {
  archivo_id: { type: DataTypes.INTEGER, primaryKey: true },
  gato_id: { type: DataTypes.INTEGER },
  tipo_archivo: { type: DataTypes.STRING(9) },
  url: { type: DataTypes.STRING(400) },
  descripcion: { type: DataTypes.TEXT },
  
}, {
  tableName: "vw_GatosMultimedia",
  timestamps: false,
});

module.exports = GatosDatos;
