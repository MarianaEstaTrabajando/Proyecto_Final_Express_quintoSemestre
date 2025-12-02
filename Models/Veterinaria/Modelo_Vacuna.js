const { DataTypes } = require("sequelize");
const sequelize = require("../../database");

const Vacuna = sequelize.define("Vacuna", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  vacuna: { type: DataTypes.STRING(200), allowNull: true },
  descripcion: { type: DataTypes.TEXT, allowNull: true },
  lugar_recetado: { type: DataTypes.STRING(200), allowNull: true },
  id_veterinario: { type: DataTypes.INTEGER, allowNull: true },
  refugio_id:{ type: DataTypes.INTEGER, allowNull: true },
}, {
  sequelize,
  tableName: "Vacuna",
  timestamps: false,
   hasTrigger: true
});

module.exports = Vacuna;
