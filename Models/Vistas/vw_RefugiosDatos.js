const  DataTypes  = require("sequelize");
const sequelize = require("../../database");

const RefugiosDatos = sequelize.define("vw_RefugiosDatos", {
  id: { type: DataTypes.INTEGER, primaryKey: true },
  nombre_refugio: { type: DataTypes.STRING(200) },
  descripcion: { type: DataTypes.TEXT },
  cantidad_gatos: { type: DataTypes.INTEGER },
  tiempo_existencia: { type: DataTypes.INTEGER },
  fondos_actuales: { type: DataTypes.DECIMAL(12,2) },
  prioridad: { type: DataTypes.DECIMAL(10,2) },
  direccion: { type: DataTypes.STRING(100) },
  telefono_contacto: { type: DataTypes.STRING(20) },
  personal: { type: DataTypes.TEXT },
}, {
  tableName: "vw_RefugiosDatos",
  timestamps: false,
});

module.exports = RefugiosDatos;
