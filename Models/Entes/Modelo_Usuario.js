const { DataTypes } = require("sequelize");
const sequelize = require("../../database");

const Usuario = sequelize.define("Usuario", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  nombre: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  apellido1: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  apellido2: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  edad: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  usuario: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  contrasena: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
}, {
  sequelize,
  tableName: "Usuario",
  timestamps: false,
   hasTrigger: true
});

module.exports = Usuario;
