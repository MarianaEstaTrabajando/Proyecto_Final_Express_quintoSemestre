const { DataTypes } = require("sequelize");
const sequelize = require("../../database");

const Foto = sequelize.define("Foto", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  dueno_id: { type: DataTypes.INTEGER, allowNull: true },
  urlImagen: { type: DataTypes.STRING(400), allowNull: true },
  tipoEntidad: { type: DataTypes.STRING(20), allowNull: true },
}, {
  sequelize,
  tableName: "Foto",
  timestamps: false,
   hasTrigger: true
});

module.exports = Foto;
