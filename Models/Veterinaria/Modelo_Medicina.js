const { DataTypes } = require("sequelize");
const sequelize = require("../../database");

const Medicina = sequelize.define("Medicina", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  descripcion: { type: DataTypes.TEXT, allowNull: true },
  lugar_recetado: { type: DataTypes.STRING(200), allowNull: true },
  id_veterinario: { type: DataTypes.INTEGER, allowNull: false },
   refugio_id:{ type: DataTypes.INTEGER, allowNull: true },
}, {
  sequelize,
  tableName: "Medicina",
  timestamps: false,
   hasTrigger: true
});

module.exports = Medicina;
