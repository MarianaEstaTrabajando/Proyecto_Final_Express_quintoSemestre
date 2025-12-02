const { Sequelize } = require("sequelize");

const sequelize = new Sequelize("Refugios_Michos", "michosAdmin", "12345678", {
  host: "localhost",
  dialect: "mssql", 
  dialectOptions: {
    options: {
      encrypt: false, 
      trustServerCertificate: true, 
    },
  },
});

// Intentar conectar
const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log("Conexión a la base de datos exitosa.");
  } catch (error) {
    console.error("No se pudo conectar a la base de datos:", error);
  }
};

testConnection();

module.exports = sequelize;
