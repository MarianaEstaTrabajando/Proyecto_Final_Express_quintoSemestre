const { DataTypes } = require("sequelize");
const sequelize = require("../../database");

const Rol = sequelize.define("Rol", {
  idRol: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  rol: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
}, {
  sequelize,
  tableName: "Rol",
  timestamps: false,
   hasTrigger: true
});

module.exports = Rol;
