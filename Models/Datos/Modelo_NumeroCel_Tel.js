const { DataTypes } = require("sequelize");
const sequelize = require("../../database");

const NumeroCel_Tel = sequelize.define("NumeroCel_Tel", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  dueno_id: { type: DataTypes.INTEGER, allowNull: true },
  celular: { type: DataTypes.STRING(20), allowNull: true },
  tipoEntidad: { type: DataTypes.STRING(20), allowNull: true },
}, {
  sequelize,
  tableName: "NumeroCel_Tel",
  timestamps: false,
   hasTrigger: true
});

module.exports = NumeroCel_Tel;
