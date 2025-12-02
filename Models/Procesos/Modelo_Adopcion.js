const { DataTypes } = require("sequelize");
const sequelize = require("../../database");

const Adopcion = sequelize.define("Adopcion", {
  id_adopcion: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  usuario_id: { type: DataTypes.INTEGER, allowNull: false },
  gato_id: { type: DataTypes.INTEGER, allowNull: false },
  trabajador_id: { type: DataTypes.INTEGER, allowNull: true },
  fecha_adopcion: { type: DataTypes.DATEONLY, allowNull: true },
  fecha_solicitud: { type: DataTypes.DATE, allowNull: true},
  estado: { type: DataTypes.STRING(20), allowNull: true },
  refugio_id: {type:DataTypes.INTEGER,allowNull:true}
}, {
  sequelize,
  tableName: "Adopcion",
  timestamps: false,
   hasTrigger: true
});

module.exports = Adopcion;
