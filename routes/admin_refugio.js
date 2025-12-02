
const express = require('express');
const { requireAnyRole } = require('../middleware/auth');
const TrabajadorController = require('../controllers/TrabajadorController');
const RefugioController=require('../controllers/RefugioController')
const router = express.Router();
const upload = require('../middleware/upload');

router.get('/home', requireAnyRole(['Admin_Refugio', 'Admin']), (req, res) => {
  res.render('admin_refugio/home', { 
    user: req.session.user 
  });
}); 

router.get('/listar_trabajadores', requireAnyRole(['Admin_Refugio', 'Admin']), TrabajadorController.listar);
router.get('/listar_trabajadores_nombre', requireAnyRole(['Admin_Refugio', 'Admin']), TrabajadorController.listarNombre);
router.get('/listar_trabajadores_edad', requireAnyRole(['Admin_Refugio', 'Admin']), TrabajadorController.listarEdad);

router.get('/listar_trabajador_id', requireAnyRole(['Admin_Refugio', 'Admin']), TrabajadorController.listarId);
router.get('/input_trabajador_formulario', requireAnyRole(['Admin_Refugio', 'Admin']), TrabajadorController.formulario);
router.post('/input_trabajador', requireAnyRole(['Admin_Refugio', 'Admin']), TrabajadorController.guardar);
router.get('/modificar_trabajador_form/:id', requireAnyRole(['Admin_Refugio', 'Admin']), TrabajadorController.modificarFormulario);
router.post('/modificar_trabajador/:id', requireAnyRole(['Admin_Refugio', 'Admin']), TrabajadorController.modificar);
router.post('/aprobar_trabajador/:id', requireAnyRole(['Admin_Refugio', 'Admin']), TrabajadorController.aprobarUsuario);
router.post('/subirFotoTrabajador', requireAnyRole(['Admin_Refugio', 'Admin']), upload.single("foto"),TrabajadorController.subirFoto);
router.post('/borrarFotoTrabajador', requireAnyRole(['Admin_Refugio', 'Admin']),upload.single("foto"), TrabajadorController.borrarFoto);
router.post('/subirDocumento', requireAnyRole(['Admin_Refugio', 'Admin']),upload.single("documento"),TrabajadorController.subirDocumento);
router.post('/borrarDocumento', requireAnyRole(['Admin_Refugio', 'Admin']), upload.single("documento"),TrabajadorController.borrarDocumento);
router.post('/subirDireccion', requireAnyRole(['Admin_Refugio', 'Admin']), TrabajadorController.subirDireccion);
router.post('/borrarDireccion', requireAnyRole(['Admin_Refugio', 'Admin']), TrabajadorController.borrarDireccion);
router.post('/subirTelefono', requireAnyRole(['Admin_Refugio', 'Admin']), TrabajadorController.subirTelefono);
router.post('/borrarTelefono', requireAnyRole(['Admin_Refugio', 'Admin']), TrabajadorController.borrarTelefono);  
router.post('/rechazar', requireAnyRole(['Admin_Refugio', 'Admin']), TrabajadorController.rechazarUsuario);  
router.post('/aprobar', requireAnyRole(['Admin_Refugio', 'Admin']), TrabajadorController.aprobarUsuario);  




router.get('/auditorias', requireAnyRole(['Admin_Refugio', 'Admin']), RefugioController.mostrarAuditorias);  
module.exports = router;