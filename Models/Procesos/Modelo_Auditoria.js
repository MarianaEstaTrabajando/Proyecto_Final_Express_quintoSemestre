const { DataTypes } = require("sequelize");
const sequelize = require("../../database");

const Auditoria = sequelize.define("Auditoria", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  tabla: { type: DataTypes.STRING(50), allowNull: true },
  accion: { type: DataTypes.STRING(20), allowNull: true },
  usuario: { type: DataTypes.INTEGER, allowNull: true },
  fecha: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
  id_registro: { type: DataTypes.STRING(50), allowNull: true },
  detalle: { type: DataTypes.TEXT, allowNull: true },
}, {
  sequelize,
  tableName: "Auditoria",
  timestamps: false,
   hasTrigger: true,
    
});

module.exports = Auditoria;
