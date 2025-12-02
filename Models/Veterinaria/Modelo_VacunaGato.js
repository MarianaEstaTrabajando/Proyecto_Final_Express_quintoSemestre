const { DataTypes } = require("sequelize");
const sequelize = require("../../database");

const VacunaGato = sequelize.define("VacunaGato", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  vacuna_id: { type: DataTypes.INTEGER, allowNull: false },
  gato_id: { type: DataTypes.INTEGER, allowNull: false },
  fecha: { type: DataTypes.DATEONLY, allowNull: true },
}, {
  sequelize,
  tableName: "VacunaGato",
  timestamps: false,
   hasTrigger: true
});

module.exports = VacunaGato;
