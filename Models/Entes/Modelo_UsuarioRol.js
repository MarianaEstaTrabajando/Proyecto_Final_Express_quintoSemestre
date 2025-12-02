const { DataTypes } = require('sequelize');
const sequelize = require('../../database');
const Usuario = require('./Modelo_Usuario');
const Rol = require('./Modelo_Rol');

const UsuarioRol = sequelize.define('UsuarioRol', {
  usuario_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    references: {
      model: Usuario,
      key: 'id'
    }
  },
  rol_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    references: {
      model: Rol,
      key: 'idRol'
    }
  },
  refugio_id: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  salario: {
    type: DataTypes.DECIMAL(10,2),
    allowNull: true
  },
  estado_usuario: {
    type: DataTypes.STRING(20),
    allowNull: true,
    validate: {
      isIn: [['aprobado', 'proceso', 'rechazado']]
    }
  },
  documentos_completos: {
    type: DataTypes.BOOLEAN,
    allowNull: true
  }
}, {
  sequelize,
  tableName: 'UsuarioRol',
  timestamps: false,
    hasTrigger: true
});

// Relaciones correctas para include anidado
Usuario.hasMany(UsuarioRol, { foreignKey: "usuario_id" });
UsuarioRol.belongsTo(Usuario, { foreignKey: "usuario_id" });

Rol.hasMany(UsuarioRol, { foreignKey: "rol_id" });
UsuarioRol.belongsTo(Rol, { foreignKey: "rol_id" });


module.exports = UsuarioRol;