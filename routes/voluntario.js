const express = require('express');
const { requireAnyRole } = require('../middleware/auth');
const GatoController = require('../controllers/GatoController');
const upload = require('../middleware/upload');
const router = express.Router();

router.get('/home', requireAnyRole(['Voluntario', 'Trabajador','Admin_Refugio', 'Admin']), (req, res) => {
  res.render('voluntario/home', { 
    user: req.session.user 
  });
});


router.get('/listar_gatos',requireAnyRole(['Voluntario', 'Trabajador','Admin_Refugio', 'Admin']), GatoController.listar);

router.get('/listar_gatos_nombre',requireAnyRole(['Voluntario', 'Trabajador','Admin_Refugio', 'Admin']), GatoController.listarNombre);

router.get('/listar_gatos_edad',requireAnyRole(['Voluntario', 'Trabajador','Admin_Refugio', 'Admin']), GatoController.listarEdad);

router.get('/listar_gatos_mayor_edad',requireAnyRole(['Voluntario', 'Trabajador','Admin_Refugio', 'Admin']), GatoController.listarEdadMayor);

router.get('/listar_gatos_menor_edad',requireAnyRole(['Voluntario', 'Trabajador','Admin_Refugio', 'Admin']), GatoController.listarEdadMenor);

router.get('/listar_gato_id',requireAnyRole(['Voluntario', 'Trabajador','Admin_Refugio', 'Admin']), GatoController.listarId);

router.get('/input_gato_formulario',requireAnyRole(['Voluntario', 'Trabajador','Admin_Refugio', 'Admin']), GatoController.formulario);

router.post('/input_gato',requireAnyRole(['Voluntario', 'Trabajador','Admin_Refugio', 'Admin']), GatoController.guardar);

router.get('/modificar_gato_form/:id',requireAnyRole(['Voluntario', 'Trabajador','Admin_Refugio', 'Admin']), GatoController.modificarFormulario);

router.post('/modificar_gato/:id',requireAnyRole(['Voluntario', 'Trabajador','Admin_Refugio', 'Admin']), GatoController.modificar);

router.post('/subirFoto', requireAnyRole(['Voluntario', 'Trabajador','Admin_Refugio', 'Admin']),upload.single("foto"), GatoController.subirFoto);

router.post('/borrarFoto', requireAnyRole(['Voluntario', 'Trabajador','Admin_Refugio', 'Admin']),upload.single("foto"), GatoController.borrarFoto);

router.post('/subirDocumento', requireAnyRole(['Voluntario', 'Trabajador','Admin_Refugio', 'Admin']),upload.single("documento"), GatoController.subirDocumento);
router.post('/borrarDocumento', requireAnyRole(['Voluntario', 'Trabajador','Admin_Refugio', 'Admin']),upload.single("documento"), GatoController.borrarDocumento);

module.exports = router;