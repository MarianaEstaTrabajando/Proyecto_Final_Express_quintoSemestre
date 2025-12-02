const { DataTypes } = require("sequelize");
const sequelize = require("../../database");

const Enfermedad = sequelize.define("Enfermedad", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  nombre: { type: DataTypes.STRING(200), allowNull: true },
  descripcion: { type: DataTypes.TEXT, allowNull: true },
  medicina_id: { type: DataTypes.INTEGER, allowNull: true },
  vacuna_id: { type: DataTypes.INTEGER, allowNull: true },
  veterinario_id: { type: DataTypes.INTEGER, allowNull: true },
  lugar_recetado: { type: DataTypes.STRING(200), allowNull: true },
   refugio_id:{ type: DataTypes.INTEGER, allowNull: true },
}, {
  sequelize,
  tableName: "Enfermedad",
  timestamps: false,
   hasTrigger: true
});

module.exports = Enfermedad;
