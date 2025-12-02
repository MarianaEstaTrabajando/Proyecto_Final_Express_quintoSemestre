const { DataTypes } = require("sequelize");
const sequelize = require("../../database");

const Refugio = sequelize.define("Refugio", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  nombre: {
    type: DataTypes.STRING(200),
    allowNull: true,
  },
  descripcion: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  cantidad_gatos: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  tiempo_existencia: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  fondos_actuales: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: true,
  },
}, {
  sequelize,
  tableName: "Refugio",
  timestamps: false,
   hasTrigger: true
});

module.exports = Refugio;
