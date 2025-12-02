const { DataTypes } = require("sequelize");
const sequelize = require("../database");

const UsoDonacionesMultimedia = sequelize.define("vw_UsoDonacionesMultimedia", {
  archivo_id: { type: DataTypes.INTEGER, primaryKey: true },
  usodonacion_id: { type: DataTypes.INTEGER },
  tipo_archivo: { type: DataTypes.STRING(20) },
  url: { type: DataTypes.STRING(400) },
  descripcion: { type: DataTypes.TEXT },
}, {
  tableName: "vw_UsoDonacionesMultimedia",
  timestamps: false,
});

module.exports = UsoDonacionesMultimedia;
 