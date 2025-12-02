const { DataTypes } = require("sequelize");
const sequelize = require("../../database");

const EnfermedadGato = sequelize.define("EnfermedadGato", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  enfermedad_id: { type: DataTypes.INTEGER, allowNull: false },
  gato_id: { type: DataTypes.INTEGER, allowNull: false },
  fecha: { type: DataTypes.DATEONLY, allowNull: true },
}, {
  sequelize,
  tableName: "EnfermedadGato",
  timestamps: false,
   hasTrigger: true
});

module.exports = EnfermedadGato;
