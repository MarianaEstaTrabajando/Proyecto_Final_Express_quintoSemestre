const { DataTypes } = require("sequelize");
const sequelize = require("../../database");

const MedicinaGato = sequelize.define("MedicinaGato", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  medicina_id: { type: DataTypes.INTEGER, allowNull: false },
  gato_id: { type: DataTypes.INTEGER, allowNull: false },
  fecha: { type: DataTypes.DATEONLY, allowNull: true },
}, {
  sequelize,
  tableName: "MedicinaGato",
  timestamps: false,
   hasTrigger: true
});

module.exports = MedicinaGato;
