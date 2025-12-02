const { DataTypes } = require("sequelize");
const sequelize = require("../../database");

const DocumentoOficial = sequelize.define("DocumentoOficial", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  dueno_id: { type: DataTypes.INTEGER, allowNull: true },
  nombre_dueno: { type: DataTypes.STRING(200), allowNull: true },
  descripcion: { type: DataTypes.TEXT, allowNull: true },
  url: { type: DataTypes.STRING(400), allowNull: true },
  fecha_emision: { type: DataTypes.DATEONLY, allowNull: true },
  fecha_subida: { type: DataTypes.DATEONLY, allowNull: true },
  tipoEntidad: { type: DataTypes.STRING(20), allowNull: true },
}, {
  sequelize,
  tableName: "DocumentoOficial",
  timestamps: false,
   hasTrigger: true
});

module.exports = DocumentoOficial;
