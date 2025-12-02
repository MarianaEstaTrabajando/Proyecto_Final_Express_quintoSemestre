const express = require('express');
const { requireAnyRole } = require('../middleware/auth');
const AdopcionController = require('../controllers/AdopcionController');
const router = express.Router();

router.get('/home', requireAnyRole(['Trabajador','Admin_Refugio', 'Admin','Adoptante','Veterinario','Voluntario']),
(req, res) => {
  res.render('usuario/home', { 
    user: req.session.user 
  }); 
});


router.get('/listar_gatos',requireAnyRole(['Trabajador','Admin_Refugio', 'Admin','Adoptante','Veterinario','Voluntario']), AdopcionController.listar);

router.get('/listar_gatos_nombre',requireAnyRole(['Trabajador','Admin_Refugio', 'Admin','Adoptante','Veterinario','Voluntario']), AdopcionController.listarNombre);

router.get('/listar_gatos_edad',requireAnyRole(['Trabajador','Admin_Refugio', 'Admin','Adoptante','Veterinario','Voluntario']), AdopcionController.listarEdad);

router.get('/listar_gatos_mayor_edad',requireAnyRole(['Trabajador','Admin_Refugio', 'Admin','Adoptante','Veterinario','Voluntario']), AdopcionController.listarEdadMayor);

router.get('/listar_gatos_menor_edad',requireAnyRole(['Trabajador','Admin_Refugio', 'Admin','Adoptante','Veterinario','Voluntario']), AdopcionController.listarEdadMenor);

router.get('/listar_gato_id',requireAnyRole(['Trabajador','Admin_Refugio', 'Admin','Adoptante','Veterinario','Voluntario']), AdopcionController.listarId);

router.get('/adoptar/:id',requireAnyRole(['Trabajador','Admin_Refugio', 'Admin','Adoptante','Veterinario','Voluntario']), AdopcionController.adoptar);

router.get('/listar_adopciones',requireAnyRole(['Trabajador','Admin_Refugio', 'Admin','Adoptante','Veterinario','Voluntario']), AdopcionController.listarAdopcionUsuario_Adop);


module.exports = router;