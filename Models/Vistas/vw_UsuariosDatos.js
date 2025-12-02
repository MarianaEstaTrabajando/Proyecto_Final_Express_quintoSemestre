// models/vwUsuariosDatos.js
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const VwUsuariosDatos = sequelize.define('VwUsuariosDatos', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    nombre: {
      type: DataTypes.STRING
    },
    apellido1: {
      type: DataTypes.STRING
    },
    apellido2: {
      type: DataTypes.STRING
    },
    edad: {
      type: DataTypes.INTEGER
    },
    usuario: {
      type: DataTypes.STRING
    },
    roles_estado: {
      type: DataTypes.TEXT   // NVARCHAR(MAX) → Sequelize usa TEXT
    },
    refugios_asignados: {
      type: DataTypes.TEXT
    },
    documentos_completos: {
      type: DataTypes.INTEGER
    },
    direcciones: {
      type: DataTypes.TEXT
    },
    telefonos: {
      type: DataTypes.TEXT
    },
    adopciones: {
      type: DataTypes.TEXT
    }
  }, {
    sequelize,
    tableName: 'vw_UsuariosDatos',
    timestamps: false // las vistas no tienen createdAt/updatedAt
  });

  return VwUsuariosDatos;
};
