const { DataTypes } = require("sequelize");
const sequelize = require("../../database");

const RefugiosMultimedia = sequelize.define("vw_RefugiosMultimedia", {
  archivo_id: { type: DataTypes.INTEGER, primaryKey: true },
  refugio_id: { type: DataTypes.INTEGER },
  tipo_archivo: { type: DataTypes.STRING(20) },
  url: { type: DataTypes.STRING(400) },
  descripcion: { type: DataTypes.TEXT },
}, {
  tableName: "vw_RefugiosMultimedia",
  timestamps: false,
});

module.exports = RefugiosMultimedia;
