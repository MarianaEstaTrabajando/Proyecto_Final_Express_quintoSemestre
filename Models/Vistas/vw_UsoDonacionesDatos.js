const { DataTypes } = require("sequelize");
const sequelize = require("../database");

const UsoDonacionesDatos = sequelize.define("vw_UsoDonacionesDatos", {
  id: { type: DataTypes.INTEGER, primaryKey: true },
  descripcion_uso: { type: DataTypes.TEXT },
  monto_usado: { type: DataTypes.DECIMAL(10,2) },
  fecha: { type: DataTypes.DATE },
  monto_donacion: { type: DataTypes.DECIMAL(10,2) },
  moneda: { type: DataTypes.STRING(10) },
  metodo_pago: { type: DataTypes.STRING(50) },
  estado_donacion: { type: DataTypes.STRING(20) },
  referencia: { type: DataTypes.STRING(100) },
  categoria: { type: DataTypes.STRING(100) },
  descripcion_categoria: { type: DataTypes.TEXT },
  donante: { type: DataTypes.STRING(200) },
  refugio_beneficiado: { type: DataTypes.STRING(200) },
  porcentaje_usado: { type: DataTypes.DECIMAL(5,2) },
}, {
  tableName: "vw_UsoDonacionesDatos",
  timestamps: false,
  
});

module.exports = UsoDonacionesDatos;
 