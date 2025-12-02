const express = require('express');
const { requireAnyRole } = require('../middleware/auth');
const router = express.Router();
const SaludController= require('../controllers/SaludController');

router.get('/home', requireAnyRole(['Veterinario', 'Trabajador','Admin_Refugio', 'Admin']), (req, res) => {
  res.render('veterinario/home', { 
    user: req.session.user 
  });
});


router.get('/listar_medicinas',requireAnyRole(['Veterinario', 'Trabajador','Admin_Refugio', 'Admin']), SaludController.listarMedicinas);
router.get('/listar_vacunas',requireAnyRole(['Veterinario', 'Trabajador','Admin_Refugio', 'Admin']), SaludController.listarVacunas);
router.get('/listar_enfermedades',requireAnyRole(['Veterinario', 'Trabajador','Admin_Refugio', 'Admin']), SaludController.listarEnfermedades);


router.post('/input_medicina',requireAnyRole(['Veterinario', 'Trabajador','Admin_Refugio', 'Admin']), SaludController.guardarMedicina);
router.post('/input_vacuna',requireAnyRole(['Veterinario', 'Trabajador','Admin_Refugio', 'Admin']), SaludController.guardarVacuna);
router.post('/input_enfermedad',requireAnyRole(['Veterinario', 'Trabajador','Admin_Refugio', 'Admin']), SaludController.guardarEnfermedad);
router.get('/input_salud',requireAnyRole(['Veterinario', 'Trabajador','Admin_Refugio', 'Admin']), SaludController.formulario);



router.post('/modificar_medicina/:id',requireAnyRole(['Veterinario', 'Trabajador','Admin_Refugio', 'Admin']), SaludController.modificarMedicina);
router.post('/modificar_vacuna/:id',requireAnyRole(['Veterinario', 'Trabajador','Admin_Refugio', 'Admin']), SaludController.modificarVacuna);
router.post('/modificar_enfermedad/:id',requireAnyRole(['Veterinario', 'Trabajador','Admin_Refugio', 'Admin']), SaludController.modificarEnfermedad);



router.get('/listar_gatos',requireAnyRole(['Veterinario', 'Trabajador','Admin_Refugio', 'Admin']), SaludController.listarGatos);
router.get('/listar_nombre',requireAnyRole(['Veterinario', 'Trabajador','Admin_Refugio', 'Admin']), SaludController.listarNombre);
router.get('/listar_id',requireAnyRole(['Veterinario', 'Trabajador','Admin_Refugio', 'Admin']), SaludController.listarId);


router.post('/enfermedad_gato/:id',requireAnyRole(['Veterinario', 'Trabajador','Admin_Refugio', 'Admin']), SaludController.enfermedadGato);
router.post('/vacuna_gato/:id',requireAnyRole(['Veterinario', 'Trabajador','Admin_Refugio', 'Admin']), SaludController.vacunaGato);
router.post('/medicina_gato/:id',requireAnyRole(['Veterinario', 'Trabajador','Admin_Refugio', 'Admin']), SaludController.medicinaGato);

module.exports = router;    