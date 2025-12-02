const express = require('express');
const { requireAnyRole } = require('../middleware/auth');
const TrabajadorController = require('../controllers/TrabajadorController');
const router = express.Router();
const upload = require('../middleware/upload');
const VeterinarioController = require('../controllers/VeterinarioController');
const VoluntarioController= require('../controllers/VoluntarioController');
const AdoptanteController= require('../controllers/AdoptanteController');
const AdopcionController = require('../controllers/AdopcionController');

router.get('/home', requireAnyRole([ 'Trabajador','Admin_Refugio', 'Admin']), (req, res) => {
  res.render('trabajador/home', { 
    user: req.session.user 
      });
  });

//Veterinarios
router.get('/listar_veterinarios', requireAnyRole(['Admin_Refugio', 'Admin']), VeterinarioController.listar);
router.get('/listar_veterinarios_nombre', requireAnyRole(['Admin_Refugio', 'Admin']), VeterinarioController.listarNombre);
router.get('/listar_veterinarios_edad', requireAnyRole(['Admin_Refugio', 'Admin']), VeterinarioController.listarEdad);

router.get('/listar_veterinario_id', requireAnyRole(['Admin_Refugio', 'Admin']), VeterinarioController.listarId);
router.get('/input_veterinario_formulario', requireAnyRole(['Admin_Refugio', 'Admin']), VeterinarioController.formulario);
router.post('/input_veterinario', requireAnyRole(['Admin_Refugio', 'Admin']), VeterinarioController.guardar);
router.get('/modificar_veterinario_form/:id', requireAnyRole(['Admin_Refugio', 'Admin']), VeterinarioController.modificarFormulario);
router.post('/modificar_veterinario/:id', requireAnyRole(['Admin_Refugio', 'Admin']), VeterinarioController.modificar);
router.post('/aprobar_veterinario/:id', requireAnyRole(['Admin_Refugio', 'Admin']), VeterinarioController.aprobarUsuario);
router.post('/subirFotoVeterinario', requireAnyRole(['Admin_Refugio', 'Admin']), upload.single("foto"),VeterinarioController.subirFoto);
router.post('/borrarFotoVeterinario', requireAnyRole(['Admin_Refugio', 'Admin']),upload.single("foto"), VeterinarioController.borrarFoto);
router.post('/subirDocumentoVeterinario', requireAnyRole(['Admin_Refugio', 'Admin']),upload.single("documento"),VeterinarioController.subirDocumento);
router.post('/borrarDocumentoVeterinario', requireAnyRole(['Admin_Refugio', 'Admin']), upload.single("documento"),VeterinarioController.borrarDocumento);
router.post('/subirDireccionVeterinario', requireAnyRole(['Admin_Refugio', 'Admin']), VeterinarioController.subirDireccion);
router.post('/borrarDireccionVeterinario', requireAnyRole(['Admin_Refugio', 'Admin']), VeterinarioController.borrarDireccion);
router.post('/subirTelefonoVeterinario', requireAnyRole(['Admin_Refugio', 'Admin']), VeterinarioController.subirTelefono);
router.post('/borrarTelefonoVeterinario', requireAnyRole(['Admin_Refugio', 'Admin']), VeterinarioController.borrarTelefono);  
router.post('/rechazarVeterinario', requireAnyRole(['Admin_Refugio', 'Admin']), VeterinarioController.rechazarUsuario);  
router.post('/aprobarVeterinario', requireAnyRole(['Admin_Refugio', 'Admin']), VeterinarioController.aprobarUsuario);  



//Voluntarios
router.get('/listar_voluntarios', requireAnyRole(['Admin_Refugio', 'Admin']), VoluntarioController.listar);
router.get('/listar_voluntarios_nombre', requireAnyRole(['Admin_Refugio', 'Admin']), VoluntarioController.listarNombre);
router.get('/listar_voluntarios_edad', requireAnyRole(['Admin_Refugio', 'Admin']), VoluntarioController.listarEdad);

router.get('/listar_voluntario_id', requireAnyRole(['Admin_Refugio', 'Admin']), VoluntarioController.listarId);
router.get('/input_voluntario_formulario', requireAnyRole(['Admin_Refugio', 'Admin']), VoluntarioController.formulario);
router.post('/input_voluntario', requireAnyRole(['Admin_Refugio', 'Admin']), VoluntarioController.guardar);
router.get('/modificar_voluntario_form/:id', requireAnyRole(['Admin_Refugio', 'Admin']), VoluntarioController.modificarFormulario);
router.post('/modificar_voluntario/:id', requireAnyRole(['Admin_Refugio', 'Admin']), VoluntarioController.modificar);
router.post('/aprobar_voluntario/:id', requireAnyRole(['Admin_Refugio', 'Admin']), VoluntarioController.aprobarUsuario);
router.post('/subirFotoVoluntario', requireAnyRole(['Admin_Refugio', 'Admin']), upload.single("foto"), VoluntarioController.subirFoto);
router.post('/borrarFotoVoluntario', requireAnyRole(['Admin_Refugio', 'Admin']), upload.single("foto"), VoluntarioController.borrarFoto);
router.post('/subirDocumentoVoluntario', requireAnyRole(['Admin_Refugio', 'Admin']), upload.single("documento"), VoluntarioController.subirDocumento);
router.post('/borrarDocumentoVoluntario', requireAnyRole(['Admin_Refugio', 'Admin']), upload.single("documento"), VoluntarioController.borrarDocumento);
router.post('/subirDireccionVoluntario', requireAnyRole(['Admin_Refugio', 'Admin']), VoluntarioController.subirDireccion);
router.post('/borrarDireccionVoluntario', requireAnyRole(['Admin_Refugio', 'Admin']), VoluntarioController.borrarDireccion);
router.post('/subirTelefonoVoluntario', requireAnyRole(['Admin_Refugio', 'Admin']), VoluntarioController.subirTelefono);
router.post('/borrarTelefonoVoluntario', requireAnyRole(['Admin_Refugio', 'Admin']), VoluntarioController.borrarTelefono);  
router.post('/rechazarVoluntario', requireAnyRole(['Admin_Refugio', 'Admin']), VoluntarioController.rechazarUsuario);  
router.post('/aprobarVoluntario', requireAnyRole(['Admin_Refugio', 'Admin']), VoluntarioController.aprobarUsuario);  


//Adoptantes
router.get('/listar_adoptantes', requireAnyRole(['Admin_Refugio', 'Admin']), AdoptanteController.listar);
router.get('/listar_adoptantes_nombre', requireAnyRole(['Admin_Refugio', 'Admin']), AdoptanteController.listarNombre);
router.get('/listar_adoptantes_edad', requireAnyRole(['Admin_Refugio', 'Admin']), AdoptanteController.listarEdad);
router.get('/listar_adoptantes_rechazados', requireAnyRole(['Admin_Refugio', 'Admin']), AdoptanteController.listarRechazados);
router.get('/listar_adoptantes_proceso', requireAnyRole(['Admin_Refugio', 'Admin']), AdoptanteController.listarProceso);

router.get('/listar_adoptante_id', requireAnyRole(['Admin_Refugio', 'Admin']), AdoptanteController.listarId);
router.get('/input_adoptante_formulario', requireAnyRole(['Admin_Refugio', 'Admin']), AdoptanteController.formulario);
router.post('/input_adoptante', requireAnyRole(['Admin_Refugio', 'Admin']), AdoptanteController.guardar);
router.get('/modificar_adoptante_form/:id', requireAnyRole(['Admin_Refugio', 'Admin']), AdoptanteController.modificarFormulario);
router.post('/modificar_adoptante/:id', requireAnyRole(['Admin_Refugio', 'Admin']), AdoptanteController.modificar);
router.post('/aprobar_adoptante/:id', requireAnyRole(['Admin_Refugio', 'Admin']), AdoptanteController.aprobarUsuario);
router.post('/subirFotoAdoptante', requireAnyRole(['Admin_Refugio', 'Admin']), upload.single("foto"), AdoptanteController.subirFoto);
router.post('/borrarFotoAdoptante', requireAnyRole(['Admin_Refugio', 'Admin']), upload.single("foto"), AdoptanteController.borrarFoto);
router.post('/subirDocumentoAdoptante', requireAnyRole(['Admin_Refugio', 'Admin']), upload.single("documento"), AdoptanteController.subirDocumento);
router.post('/borrarDocumentoAdoptante', requireAnyRole(['Admin_Refugio', 'Admin']), upload.single("documento"), AdoptanteController.borrarDocumento);
router.post('/subirDireccionAdoptante', requireAnyRole(['Admin_Refugio', 'Admin']), AdoptanteController.subirDireccion);
router.post('/borrarDireccionAdoptante', requireAnyRole(['Admin_Refugio', 'Admin']), AdoptanteController.borrarDireccion);
router.post('/subirTelefonoAdoptante', requireAnyRole(['Admin_Refugio', 'Admin']), AdoptanteController.subirTelefono);
router.post('/borrarTelefonoAdoptante', requireAnyRole(['Admin_Refugio', 'Admin']), AdoptanteController.borrarTelefono);  
router.post('/rechazarAdoptante', requireAnyRole(['Admin_Refugio', 'Admin']), AdoptanteController.rechazarUsuario);  
router.post('/aprobarAdoptante', requireAnyRole(['Admin_Refugio', 'Admin']), AdoptanteController.aprobarUsuario);


router.get('/listarAdopcionesProceso',requireAnyRole(['Trabajador','Admin_Refugio', 'Admin']), AdopcionController.listarAdopcionesProceso);     
router.get('/listarAdopcionesHechas',requireAnyRole(['Trabajador','Admin_Refugio', 'Admin']), AdopcionController.listarAdopcionesHechas);     
router.get('/listarAdopcionesRechazadas',requireAnyRole(['Trabajador','Admin_Refugio', 'Admin']), AdopcionController.listarAdopcionesRechazadas);    

router.post('/aceptarAdopcion/:id',requireAnyRole(['Trabajador','Admin_Refugio', 'Admin']), AdopcionController.aceptarAdopcion);     
router.post('/rechazarAdopcion/:id',requireAnyRole(['Trabajador','Admin_Refugio', 'Admin']), AdopcionController.rechazarAdopcion);    

router.get('/listarAdopcionId',requireAnyRole(['Trabajador','Admin_Refugio', 'Admin']), AdopcionController.listarAdopcionUsuario);





module.exports = router;