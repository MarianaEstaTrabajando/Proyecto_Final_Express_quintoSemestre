const { DataTypes } = require("sequelize");
const sequelize = require("../../database");

const Gato = sequelize.define("Gato", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  nombre: { type: DataTypes.STRING(100), allowNull: true },
  refugio_id: { type: DataTypes.INTEGER, allowNull: false },
  descripcion: { type: DataTypes.TEXT, allowNull: true },
  temperamento: { type: DataTypes.STRING(200), allowNull: true },
  edad: { type: DataTypes.INTEGER, allowNull: true },
  raza: { type: DataTypes.STRING(100), allowNull: true },
  estado: { type: DataTypes.STRING(20), allowNull: true },
}, {
   sequelize,
  tableName: "Gato",
  timestamps: false,
    hasTrigger: true
});

module.exports = Gato;
