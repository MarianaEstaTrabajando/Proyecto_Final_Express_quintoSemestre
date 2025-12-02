const express = require('express');
const { requireRole } = require('../middleware/auth');
const { requireAnyRole } = require('../middleware/auth');
const AdminRefugioController = require('../controllers/AdminRefugioController');
const RefugioController= require('../controllers/RefugioController')
const router = express.Router();
const upload = require('../middleware/upload');


router.use((req, res, next) => {
  if (req.session.user && req.session.user.rol === 'Admin') {
    next();
  } else {
    res.redirect('/auth/login'); 
  }
});



router.get('/listar_admins_refugio', requireRole('Admin'), AdminRefugioController.listar);
router.get('/listar_admins_refugio_nombre',requireRole('Admin'), AdminRefugioController.listarNombre);
router.get('/listar_admins_refugio_edad', requireRole('Admin'), AdminRefugioController.listarEdad);

router.get('/listar_admin_refugio_id', requireRole('Admin'), AdminRefugioController.listarId);
router.get('/input_admin_refugio_formulario',requireRole('Admin'), AdminRefugioController.formulario);
router.post('/input_admin_refugio', requireRole('Admin'), AdminRefugioController.guardar);
router.get('/modificar_admin_refugio_form/:id', requireRole('Admin'), AdminRefugioController.modificarFormulario);
router.post('/modificar_admin_refugio/:id',requireRole('Admin'), AdminRefugioController.modificar);
router.post('/aprobar_admin_refugio/:id',requireRole('Admin'), AdminRefugioController.aprobarUsuario); // Ruta que quedó en desuso, usar /aprobar
router.post('/subirFotoAdminRefugio',requireRole('Admin'), upload.single("foto"), AdminRefugioController.subirFoto);
router.post('/borrarFotoAdminRefugio', requireRole('Admin'), upload.single("foto"), AdminRefugioController.borrarFoto);
router.post('/subirDocumento', requireRole('Admin'), upload.single("documento"), AdminRefugioController.subirDocumento);
router.post('/borrarDocumento', requireRole('Admin'), upload.single("documento"), AdminRefugioController.borrarDocumento);
router.post('/subirDireccion', requireRole('Admin'), AdminRefugioController.subirDireccion);
router.post('/borrarDireccion', requireRole('Admin'), AdminRefugioController.borrarDireccion);
router.post('/subirTelefono',requireRole('Admin'), AdminRefugioController.subirTelefono);
router.post('/borrarTelefono', requireRole('Admin'), AdminRefugioController.borrarTelefono); 
router.post('/rechazar', requireRole('Admin'), AdminRefugioController.rechazarUsuario); 
router.post('/aprobar', requireRole('Admin'), AdminRefugioController.aprobarUsuario);



// Listar refugios
router.get('/listar_refugios', requireRole('Admin'), RefugioController.listar);

// Listar refugio por ID
router.get('/listar_refugio_id', requireRole('Admin'), RefugioController.listarId);

//Creacion
router.get('/input_refugio_formulario',requireRole('Admin'), RefugioController.formulario);
router.post('/input_refugio', requireRole('Admin'), RefugioController.guardar);

// Modificación
router.get('/modificar_refugio_form/:id',requireRole('Admin'), RefugioController.modificarFormulario);
router.post('/modificar_refugio/:id', requireRole('Admin'), RefugioController.modificar);

// Fotos
router.post('/subirFotoRefugio', requireRole('Admin'), upload.single("foto"), RefugioController.subirFoto);
router.post('/borrarFotoRefugio',requireRole('Admin'), RefugioController.borrarFoto);

// Documentos
router.post('/subirDocumentoRefugio', requireRole('Admin'), upload.single("documento"), RefugioController.subirDocumento);
router.post('/borrarDocumentoRefugio',requireRole('Admin'), RefugioController.borrarDocumento);

router.post('/cambiar_refugio',requireRole('Admin'), RefugioController.elegirRefugio);

router.post('/eliminar_usuario', requireAnyRole(['Trabajador','Admin_Refugio', 'Admin','Adoptante','Veterinario','Voluntario']), RefugioController.eliminarUsuario);
router.get('/eliminar_usuario', requireAnyRole(['Trabajador','Admin_Refugio', 'Admin','Adoptante','Veterinario','Voluntario']), RefugioController.eliminarUsuarioForm);



router.get('/dashboard', requireRole('Admin'), (req, res) => {
  res.render('admin/dashboard', { 
    title: 'Dashboard Admin',
    user: req.session.user 
  });
});

module.exports = router;