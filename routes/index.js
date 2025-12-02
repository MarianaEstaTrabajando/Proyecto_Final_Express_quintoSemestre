const express = require('express');
const router = express.Router();
const UnknownController=require('../controllers/UnknownController');
const upload = require('../middleware/upload');

router.get('/', UnknownController.listar);

//Ver página con gatos
router.get('/listar_gatos_nombre',UnknownController.listarNombre);

router.get('/listar_gatos_edad',UnknownController.listarEdad);

router.get('/listar_gatos_mayor_edad', UnknownController.listarEdadMayor);

router.get('/listar_gatos_menor_edad', UnknownController.listarEdadMenor);

router.get('/listar_gato_id', UnknownController.listarId);

router.get('/input_adoptante_form', UnknownController.formulario);

//Registrarse
router.post('/input_adoptante',  UnknownController.guardar);
router.post('/subirFotoAdoptante',  upload.single("foto"), UnknownController.subirFoto);

router.post('/subirDocumentoAdoptante', upload.single("documento"), UnknownController.subirDocumento);

router.post('/subirDireccionAdoptante',  UnknownController.subirDireccion);

router.post('/subirTelefonoAdoptante',UnknownController.subirTelefono);


module.exports = router;
