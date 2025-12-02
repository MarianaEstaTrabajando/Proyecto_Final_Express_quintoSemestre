const express = require('express');
const  Usuario  = require('../Models/Entes/Modelo_Usuario');
const  Rol  = require('../Models/Entes/Modelo_Rol');
const  UsuarioRol = require('../Models/Entes/Modelo_UsuarioRol');
const router = express.Router();

console.log("Usuario importado:", Usuario);
console.log("Rol importado:", Rol);
console.log("UsuarioRol importado:", UsuarioRol);


// Mostrar formulario de login
router.get('/login', (req, res) => {
  res.render('login', { error: null });
});

// Procesar login 
router.post('/login', async (req, res) => {

  
  const { usuario, contrasena } = req.body;

  try {
    console.log('Buscando usuario:', usuario);
    
    // Buscar usuario con la relación correcta
    const user = await Usuario.findOne({
      where: { 
        usuario: usuario, 
        contrasena: contrasena 
      },
      include: [{
        model: UsuarioRol,
        where: { estado_usuario: 'aprobado' },
        include: [{
          model: Rol
        }]
      }]
    });

    if (user && user.UsuarioRols && user.UsuarioRols.length > 0) {
      // Acceder a través del rol
      const rol = user.UsuarioRols[0].Rol;      const userRol= user.UsuarioRols[0];
      let refugioClave=0;
      if(userRol.refugio_id!=null){
        refugioClave=user.refugio_id;
      }
      
      // Guardar usuario en sesión
      req.session.user = {
        id: user.id,
        usuario: user.usuario,
        nombre: user.nombre,
        rol: rol.rol,
        refugio_id: refugioClave
      };

      console.log('Login exitoso, rol:', req.session.user.rol);

      // Redirigir según el rol
      switch (req.session.user.rol) {
        case 'Admin':
          return res.redirect('/admin/dashboard');
        case 'Admin_Refugio':
          return res.redirect('/admin_refugio/home');
        case 'Trabajador':
          return res.redirect('/trabajador/home');
        case 'Veterinario':
          return res.redirect('/veterinario/home');
        case 'Voluntario':
          return res.redirect('/voluntario/home');
        case 'Adoptante':
          return res.redirect('/usuario/home');
        default:
          return res.redirect('/');
      }
    } else {
      console.log('Credenciales incorrectas o usuario no aprobado');
      res.render('login', { 
        error: 'Usuario, contraseña incorrectos o cuenta no aprobada' 
      });
    }
  } catch (error) {
    console.error('ERROR en login:', error);
    res.render('login', { 
      error: 'Error en el servidor: ' + error.message 
    });
  }
});

//Ir a página principal
router.get('/login2', (req,res) =>{
   if (!req.session.user) {
        return res.redirect('/auth/login'); 
    }
      switch (req.session.user.rol) {
        case 'Admin':
          return res.redirect('/admin/dashboard');
        case 'Admin_Refugio':
          return res.redirect('/admin_refugio/home');
        case 'Trabajador':
          return res.redirect('/trabajador/home');
        case 'Veterinario':
          return res.redirect('/veterinario/home');
        case 'Voluntario':
          return res.redirect('/voluntario/home');
        case 'Adoptante':
          return res.redirect('/usuario/home');
        default:
          return res.redirect('/');}

});



// Logout
router.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Error al cerrar sesión:', err);
    }
    res.redirect('/');
  });
});

module.exports = router;