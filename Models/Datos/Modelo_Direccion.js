const { DataTypes } = require("sequelize");
const sequelize = require("../../database");

const Direccion = sequelize.define("Direccion", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  dueno_id: { type: DataTypes.INTEGER, allowNull: true },
  direccion: { type: DataTypes.STRING(100), allowNull: true },
  tipoEntidad: { type: DataTypes.STRING(20), allowNull: true },
}, {
  sequelize,
  tableName: "Direccion",
  timestamps: false,
   hasTrigger: true
});

module.exports = Direccion;
