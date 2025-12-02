const express = require('express');
const session = require('express-session');
const path = require('path');
const bodyParser = require("body-parser");
const sequelize = require("./database");
const setUserSession=require('./middleware/setUserSession')


const app = express();



app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Configuración de sesiones
app.use(session({
  secret: 'tu-clave-secreta-aqui',
  resave: false,
  saveUninitialized: false,
  cookie: { 
    secure: false, 
    maxAge: 24 * 60 * 60 * 1000 
  }
}));

// Middleware para hacer user disponible en todas las vistas
app.use((req, res, next) => {
  res.locals.session = req.session;
  next();
});

app.use("/", setUserSession);
app.use(express.static("public"));


// Configuración de EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Rutas
app.use('/', require('./routes/index'));
app.use('/auth', require('./routes/auth'));
app.use('/admin', require('./routes/admin'));
app.use('/trabajador', require('./routes/trabajador'));
app.use('/voluntario', require('./routes/voluntario'));
app.use('/veterinario', require('./routes/veterinario'));
app.use('/admin_refugio', require('./routes/admin_refugio'));
app.use('/usuario', require('./routes/usuario'));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));



// Server
app.listen(3000, async () => {
  try {
    await sequelize.authenticate();
    console.log("Conectado a SQL Server");
    console.log("Servidor en http://localhost:3000");
  } catch (error) {
    console.error("Error:", error);
  }
});