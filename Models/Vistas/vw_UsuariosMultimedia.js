const { DataTypes } = require("sequelize");
const sequelize = require("../database");

const UsuariosMultimedia = sequelize.define("vw_UsuariosMultimedia", {
  archivo_id: { type: DataTypes.INTEGER, primaryKey: true },
  usuario_id: { type: DataTypes.INTEGER },
  tipo_archivo: { type: DataTypes.STRING(20) },
  url: { type: DataTypes.STRING(400) },
  descripcion: { type: DataTypes.TEXT },
}, {
  tableName: "vw_UsuariosMultimedia",
  timestamps: false,
});

module.exports = UsuariosMultimedia;
