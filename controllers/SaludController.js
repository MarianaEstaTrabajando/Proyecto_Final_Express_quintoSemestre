const fs = require("fs");
const path = require("path");
const { Op, Sequelize } = require("sequelize");
const sequelize = require('../database');
const Vacuna=require('../Models/Veterinaria/Modelo_Vacuna');
const Medicina=require('../Models/Veterinaria/Modelo_Medicina');
const Enfermedad=require('../Models/Veterinaria/Modelo_Enfermedad');
const VacunaGato=require('../Models/Veterinaria/Modelo_VacunaGato');
const MedicinaGato=require('../Models/Veterinaria/Modelo_MedicinaGato');
const EnfermedadGato=require('../Models/Veterinaria/Modelo_EnfermedadGato');
const Gato=require('../Models/Entes/Modelo_Gato');

module.exports ={

//Listar
   async listarVacunas(req,res){
  try{
    let vacunas;
    const user=req.session.user;
    const refugio_id=user.refugio_id;

    if(refugio_id){
    vacunas= await Vacuna.findAll({
    where: {
      [Op.or]: [
      { refugio_id: refugio_id }, // vacunas del refugio
      { refugio_id: null }        // vacunas globales
       ]},
       order: [["id", "ASC"]]
    });
  }
    else{
    vacunas= await Vacuna.findAll({
         order: [["id", "ASC"]]
    });
    }

     res.render('veterinario/salud_base/vacunas', { vacunas });

}
catch(error){
res.status(500).send("Error al obtener vacunas: " + error.message);
}
  },

   async listarMedicinas(req,res){
  try{
    let medicinas;
    const user=req.session.user;
    const refugio_id=user.refugio_id;

    if(refugio_id){
    medicinas= await Medicina.findAll({
    where: {
      [Op.or]: [
      { refugio_id: refugio_id }, 
      { refugio_id: null }       
       ]},
       order: [["id", "ASC"]]
    });
  }
    else{
    medicinas= await Medicina.findAll({
         order: [["id", "ASC"]]
    });
    }

     res.render('veterinario/salud_base/medicinas', { medicinas });

}
catch(error){
res.status(500).send("Error al obtener medicinas: " + error.message);
}
  },
   

     async listarEnfermedades(req,res){
  try{
    let enfermedades;
    const user=req.session.user;
    const refugio_id=user.refugio_id;

    if(refugio_id){
    enfermedades= await Enfermedad.findAll({
    where: {
      [Op.or]: [
      { refugio_id: refugio_id }, // vacunas del refugio
      { refugio_id: null }        // vacunas globales
       ]},
       order: [["id", "ASC"]]
    });
  }
    else{
    enfermedades= await Enfermedad.findAll({
         order: [["id", "ASC"]]
    });
    }

     res.render('veterinario/salud_base/enfermedades', { enfermedades });

}
catch(error){
res.status(500).send("Error al obtener enfermedades: " + error.message);
}
  },

//Modificar form


  formulario(req, res) {
    user = req.session.user;
     res.render("veterinario/salud_base/input_salud", {user});
  },

  //Crear salud

  async guardarVacuna(req, res) {
   try{
    const { vacuna,descripcion, lugar_recetado } = req.body;
    const user=req.session.user;
    const id_veterinario=user.id;
    let refugio_id=null;

    if(user.refugio_id){
     refugio_id=user.refugio_id
    }

     await Vacuna.create(
      {
        vacuna,
        descripcion,
        lugar_recetado,
        id_veterinario,
        refugio_id

      }
    );
     return res.json({ mensaje: "Vacuna creada" });

   }
    catch (error) {
      res.status(500).send("Error al guardar medicina: " + error.message);
    }
  },



  //Guardar
   async guardarMedicina(req, res) {
   try{
    const { descripcion, lugar_recetado } = req.body;
    const user=req.session.user;
    const id_veterinario=user.id;
    let refugio_id=null;

    if(user.refugio_id){
      refugio_id=user.refugio_id
    }

    await Medicina.create(
      {
        descripcion,
        lugar_recetado,
        id_veterinario,
        refugio_id

      }
    );
    return  res.json({ mensaje: "Medicina creada" });

   }
    catch (error) {
     return res.status(500).send("Error al guardar medicina: " + error.message);
    }

  },

   async guardarEnfermedad(req, res) {
   try{
    const {nombre, descripcion, lugar_recetado,medicina_id,vacuna_id } = req.body;
    const user=req.session.user;
    const id_veterinario=user.id;
    let refugio_id=null;

    if(user.refugio_id){
     refugio_id=user.refugio_id
    }

    if(!vacuna_id&&!medicina_id){
     return res.json({ mensaje: "No se han insertado vacunas ni medicinas" });
    }

    const vacuna= await Vacuna.findByPk(vacuna_id);
    const medicina=await Medicina.findByPk(medicina_id);

    if(!vacuna&&!medicina){
       return res.json({ mensaje: "La enfermedad no tiene ni vacuna, ni medicina" });
    }
    else{
      if(vacuna){
      if(vacuna.refugio_id!=refugio_id&&refugio_id){
        return res.json({ mensaje: "La vacuna insertada no existe en el refugio" });
      }}

      if(medicina){
      if(medicina.refugio_id!=refugio_id&&refugio_id){
        return res.json({ mensaje: "La medicina insertada no existe en el refugio" });
      }
      }
    }

    const enfermedad =await Enfermedad.create(
      {
       nombre:nombre,
        descripcion,
        lugar_recetado,
        id_veterinario:user.id,
        refugio_id:refugio_id,
        

      }
    );

    if(vacuna){
      await enfermedad.update({
        vacuna_id:vacuna_id
      })
    }
    if(medicina){
      await enfermedad.update({
        medicina_id:medicina_id
      })
    }
    return res.json({ mensaje: "Enfermedad creada" });

   }
    catch (error) {
      res.status(500).send("Error al guardar enfermedad: " + error.message);
    }
  },

  //Modificar 
  async modificarVacuna(req, res) {
  try {
    const  id  = parseInt(req.params.id);
    console.log("ID A MODIFICAR: ",id);
    let { vacuna, descripcion, lugar_recetado, id_veterinario, refugioId } = req.body;


    let refugio_id;
    const user = req.session.user;

    if(user.refugio_id){
      refugio_id=user.refugio_id;
    }
    else{
      if(refugioId){
      refugio_id=parseInt(refugioId);}
      else{
        refugio_id=null;
      }
    }

        console.log("refugioId: ",refugioId);
    console.log("refugio_id: ",refugio_id);
    console.log("id_veterinario: ",id_veterinario);
  
    const vacunaExist = await Vacuna.findByPk(id);
    if (!vacunaExist) {
    return res.status(404).json({ mensaje: "Vacuna no encontrada" });
    }


    await Vacuna.update(
      {vacuna,descripcion,lugar_recetado,id_veterinario,refugio_id},
      { where: { id } }
    );
    return res.redirect('/veterinario/listar_vacunas');
  } catch (error) {
    res.status(500).send("Error al modificar vacuna: " + error.message);
  }
},

  async modificarMedicina(req, res) {
  try {
    const  id  = parseInt(req.params.id);
    console.log("ID A MODIFICAR: ",id);
    let { descripcion, lugar_recetado, id_veterinario, refugioId } = req.body;
  
    let refugio_id=refugioId;
    const user = req.session.user;

    if(user.refugio_id){
      refugio_id=user.refugio_id;
    }
    else{
      if(refugioId){
      refugio_id=parseInt(refugioId);}
      else{
        refugio_id=null;
      }
    }

    
    const medicinaExist = await Medicina.findByPk(id);
    if (!medicinaExist) {
    return res.status(404).json({ mensaje: "Medicina no encontrada" });
    }

    await Medicina.update(
      {descripcion,lugar_recetado,id_veterinario,refugio_id},
      { where: { id } }
    );
   return res.redirect('/veterinario/listar_medicinas');
  } catch (error) {
    res.status(500).send("Error al modificar medicina: " + error.message);
  }
},

  async modificarEnfermedad(req, res) {
  try {
    const  id  = parseInt(req.params.id);
    console.log("ID A MODIFICAR: ",id);
    let {nombre, descripcion, lugar_recetado, id_veterinario, refugioId,medicina_id,vacuna_id } = req.body;
  
    let refugio_id=refugioId;
    const user = req.session.user;

    if(user.refugio_id){
      refugio_id=user.refugio_id;
    }
    else{
      if(refugioId){
      refugio_id=parseInt(refugioId);}
      else{
        refugio_id=null;
      }
    }

     if(!vacuna_id&&!medicina_id){
     return res.json({ mensaje: "No se han insertado vacunas ni medicinas" });
    }

    const vacuna= await Vacuna.findByPk(vacuna_id);
    const medicina=await Medicina.findByPk(medicina_id);

   
   if(vacuna){
      if(vacuna.refugio_id!=refugio_id&&refugio_id){
        return res.json({ mensaje: "La vacuna insertada no existe" });
      }
    }

      if(medicina){
      
      if(medicina.refugio_id!=refugio_id&&refugio_id){
        return res.json({ mensaje: "La medicina insertada no existe" });
      }
    }

    await Enfermedad.update(
      {nombre, descripcion,lugar_recetado,id_veterinario,refugio_id},
      { where: { id } }
    );
    
   return res.json({message:"Se modificó la enfermedad"});
  } catch (error) {
    res.status(500).send("Error al modificar enfermedad: " + error.message);
  }
},

//Gatos opciones

async listarGatos(req, res) {
  try {
    const user = req.session.user; 
   
    const gatosRaw = await sequelize.query(
      `SELECT g.id, g.nombre_gato, g.descripcion, mg.refugio_id, m.url
       FROM vw_GatosDatos g
       LEFT JOIN vw_GatosMultimedia m ON g.id = m.gato_id
       JOIN Gato mg ON mg.id = g.id
       WHERE m.tipo_archivo = 'foto' and (mg.estado = 'libre' OR mg.estado = 'proceso')`,
      { type: sequelize.QueryTypes.SELECT }
    );

    const gatosMap = {};
    const gatos = [];
     console.log("gatosRaw longitud: ",gatosRaw.length);

    console.log("gatosRaw: ",gatosRaw);

    gatosRaw.forEach(row => {
      

      const pertenece = !user.refugio_id || row.refugio_id == user.refugio_id;

      if (!pertenece) return;

  
      if (!gatosMap[row.id]) {
        gatosMap[row.id] = {
          id: row.id,
          nombreGato: row.nombre_gato,
          descripcion: row.descripcion,
          vw_GatosMultimedia: []
        };
        gatos.push(gatosMap[row.id]);
      }
 console.log("gatos longitud: ",gatos.length);
      // Agregar imagen
      if (row.url) {
        gatosMap[row.id].vw_GatosMultimedia.push({ url: row.url });
      }
    });
console.log("GATOS A ENVIAR A LA VISTA:", gatos);

    res.render('veterinario/gatos', { gatos });
  } catch (error) {
    res.status(500).send("Error al obtener gatos: " + error.message);
  }
},


async listarNombre(req, res) {
  try {
    const user= req.session.user;
   const nombre=req.query.nombre;
   console.log("nombre: ",nombre)
    const gatosRaw = await sequelize.query(
      `SELECT g.id, g.nombre_gato, g.descripcion, mg.refugio_id, m.url
       FROM vw_GatosDatos g
       LEFT JOIN vw_GatosMultimedia m ON g.id = m.gato_id
       JOIN Gato mg ON mg.id = g.id
       WHERE m.tipo_archivo = 'foto'AND g.nombre_gato LIKE :nombre and 
       (mg.estado = 'libre' OR mg.estado = 'proceso')`,
      {
        type: sequelize.QueryTypes.SELECT,
        replacements: {
          nombre: `%${nombre}%`
        }
      }
    );

    const gatosMap = {};
    const gatos = [];
     console.log("gatosRaw longitud: ",gatosRaw.length);

    console.log("gatosRaw: ",gatosRaw);

    gatosRaw.forEach(row => {
      

      const pertenece = !user.refugio_id || row.refugio_id == user.refugio_id;

      if (!pertenece) return;

    
      if (!gatosMap[row.id]) {
        gatosMap[row.id] = {
          id: row.id,
          nombreGato: row.nombre_gato,
          descripcion: row.descripcion,
          vw_GatosMultimedia: []
        };
        gatos.push(gatosMap[row.id]);
      }
 console.log("gatos longitud: ",gatos.length);
      // Agregar imagen
      if (row.url) {
        gatosMap[row.id].vw_GatosMultimedia.push({ url: row.url });
      }
    });
console.log("GATOS A ENVIAR A LA VISTA:", gatos);

    res.render('veterinario/gatos', { gatos });
  } catch (error) {
    res.status(500).send("Error al obtener gatos: " + error.message);
  }
},


async listarId(req, res) {
  try {
    const user = req.session.user;

    console.log("EL ID ES: ", req.query.id)
    const id = parseInt(req.query.id);
    

    const gatosRaw = await sequelize.query(
      `SELECT g.id, g.nombre_gato, g.descripcion,g.temperamento,g.edad_gato,g.raza,g.estado,g.refugio, g.medicinas,g.enfermedades,
      g.vacunas, mg.refugio_id,
              m.url, m.tipo_archivo
       FROM vw_GatosDatos g
       LEFT JOIN vw_GatosMultimedia m ON g.id = m.gato_id
       JOIN Gato mg ON mg.id = g.id
       WHERE mg.id = :id and (mg.estado = 'libre' OR mg.estado = 'proceso')`,
      {
        type: sequelize.QueryTypes.SELECT,
        replacements: { id }
      }
    );

    const gatosMap = {};
    const gatos = [];

    gatosRaw.forEach(row => {
      const pertenece = !user.refugio_id || row.refugio_id == user.refugio_id;
      if (!pertenece) return;

      if (!gatosMap[row.id]) {
        gatosMap[row.id] = {
          id: row.id,
          nombreGato: row.nombre_gato,
          descripcion: row.descripcion,
          temperamento: row.temperamento,
          edad_gato: row.edad_gato,
          raza: row.raza,
          estado: row.estado,
          refugio: row.refugio,
          medicinas: row.medicinas,
          enfermedades: row.enfermedades,
          vacunas: row.vacunas,
          fotos: [],
          documentos: []
        };
        gatos.push(gatosMap[row.id]);
      }

      // Clasificar archivos
      if (row.url) {
        if (row.tipo_archivo === "foto") {
          gatosMap[row.id].fotos.push({ url: row.url });
        } else if (row.tipo_archivo === "documento") {
          gatosMap[row.id].documentos.push({ url: row.url });
        }
      }
    });

   
    res.render("veterinario/gato_detalles.ejs", { gatos });

  } catch (error) {
    res.status(500).send("Error al obtener gatos: " + error.message);
  }
},


//Gatos veterinaria
//Crear

async vacunaGato (req,res){
    try{
      const  id  = parseInt(req.params.id);
      let vacuna_id=parseInt(req.body.vacuna_id);
      const user=req.session.user;
      const refugio_id=user.refugio_id;

      const gato_encontrado= await Gato.findByPk(id);
      const vacuna= await Vacuna.findByPk(vacuna_id);
      const vacuna_gato= await VacunaGato.findOne({where: { vacuna_id:vacuna_id, gato_id:id } }); 

      if(!gato_encontrado){
         res.json({ mensaje: "El gato no existe" });
      }

      if(refugio_id && gato_encontrado.refugio_id!=refugio_id){
        res.json({ mensaje: "El gato no pertenece a tu refugio" });
      }


      if(!vacuna){
         res.json({ mensaje: "La vacuna no existe" });
      }

      if(refugio_id && vacuna.refugio_id!=refugio_id){
        res.json({ mensaje: "La vacuna no pertenece a tu refugio" });
      }

      if(vacuna_gato){
        res.json({ mensaje: "La vacuna ya está asignada al gato" });
      }

      await VacunaGato.create({
        vacuna_id:vacuna_id,
        gato_id:id

      });

res.json({message:"Se le puso la vacuna  al gato"})
  }catch (error){
 res.status(500).send("Error al obtener gatos: " + error.message);
  }
  
},


async medicinaGato (req,res){
    try{
      const  id  = parseInt(req.params.id);
      let medicina_id=parseInt(req.body.medicina_id);
      const user=req.session.user;
      const refugio_id=user.refugio_id;

      const gato_encontrado= await Gato.findByPk(id);
      const medicina= await Medicina.findByPk(medicina_id);
      const medicina_gato= await MedicinaGato.findOne({where: { medicina_id:medicina_id, gato_id:id } }); 

      if(!gato_encontrado){
         res.json({ mensaje: "El gato no existe" });
      }

      if(refugio_id && gato_encontrado.refugio_id!=refugio_id){
        res.json({ mensaje: "El gato no pertenece a tu refugio" });
      }


      if(!medicina){
         res.json({ mensaje: "La medicina no existe" });
      }

      if(refugio_id && medicina.refugio_id!=refugio_id){
        res.json({ mensaje: "La medicina no pertenece a tu refugio" });
      }

      if(medicina_gato){
        res.json({ mensaje: "La medicina ya está asignada al gato" });
      }


      await MedicinaGato.create({
        medicina_id:medicina_id,
        gato_id:id

      });
       res.json({message:"Se le puso la medicina al gato"})


  }catch (error){
 res.status(500).send("Error poner la medicina: " + error.message);
  }
  
},


async enfermedadGato (req,res){
    try{
      const  id  = parseInt(req.params.id);
      let enfermedad_id=parseInt(req.body.enfermedad_id);
      const user=req.session.user;
      const refugio_id=user.refugio_id;

      const gato_encontrado= await Gato.findByPk(id);
      const enfermedad= await Enfermedad.findByPk(enfermedad_id);
      const enfermedad_gato= await EnfermedadGato.findOne({where: { enfermedad_id:enfermedad_id, gato_id:id } }); 

      if(!gato_encontrado){
         res.json({ mensaje: "El gato no existe" });
      }

      if(refugio_id && gato_encontrado.refugio_id!=refugio_id){
        res.json({ mensaje: "El gato no pertenece a tu refugio" });
      }


      if(!enfermedad){
         res.json({ mensaje: "La enfermedad no existe" });
      }

      if(refugio_id && enfermedad.refugio_id!=refugio_id){
        res.json({ mensaje: "La enfermedad no pertenece a tu refugio" });
      }

      if(enfermedad_gato){
        res.json({ mensaje: "La enfermedad ya está asignada al gato" });
      }


      await EnfermedadGato.create({
        enfermedad_id:enfermedad_id,
        gato_id:id,
        medicina_id:enfermedad.medicina_id,
        vacuna_id:enfermedad.vacuna_id
      });

      
      const vacuna = await VacunaGato.findOne({where: {vacuna_id: enfermedad.vacuna_id, gato_id:id}})
      const medicina = await MedicinaGato.findOne({where: {medicina_id: enfermedad.medicina_id, gato_id:id}})

      if(!vacuna&&enfermedad.vacuna_id){
      await VacunaGato.create({
        vacuna_id:enfermedad.vacuna_id,
        gato_id:id

});
      }

      if(!medicina&&enfermedad.medicina_id){
await MedicinaGato.create({
        medicina_id:enfermedad.medicina_id,
        gato_id:id

});
      }

      res.json({message:"Se le puso la enfermedad al gato, junto con la medicina y vacuna"})


  }catch (error){
 res.status(500).send("Error al obtener gatos: " + error.message);
  }
  
},


//Eliminar gatos veterinaria

async eliminarVacunaGato(req, res) {
    try {
      const id = parseInt(req.params.id); 
      const { vacuna_id } = req.body;
      const user = req.session.user;

    
      const gato = await Gato.findByPk(id);
      if (!gato) {
        return res.status(404).json({ mensaje: "El gato no existe" });
      }
      if (user.refugio_id && gato.refugio_id != user.refugio_id) {
        return res.status(403).json({ mensaje: "No tienes permiso para modificar este gato" });
      }


      const relacion = await VacunaGato.findOne({
        where: { gato_id: id, vacuna_id: vacuna_id }
      });

      if (!relacion) {
        return res.status(404).json({ mensaje: "Esa vacuna no está asignada a este gato" });
      }

      await relacion.destroy();
      return res.json({ mensaje: "Vacuna eliminada del historial del gato" });

    } catch (error) {
      return res.status(500).send("Error al eliminar vacuna del gato: " + error.message);
    }
  },

  async eliminarMedicinaGato(req, res) {
    try {
      const id = parseInt(req.params.id); 
      const { medicina_id } = req.body;
      const user = req.session.user;

    
      const gato = await Gato.findByPk(id);
      if (!gato) {
        return res.status(404).json({ mensaje: "El gato no existe" });
      }
      if (user.refugio_id && gato.refugio_id != user.refugio_id) {
        return res.status(403).json({ mensaje: "No tienes permiso para modificar este gato" });
      }

     
      const relacion = await MedicinaGato.findOne({
        where: { gato_id: id, medicina_id: medicina_id }
      });

      if (!relacion) {
        return res.status(404).json({ mensaje: "Esa medicina no está asignada a este gato" });
      }

     
      await relacion.destroy();
      return res.json({ mensaje: "Medicina eliminada del historial del gato" });

    } catch (error) {
      return res.status(500).send("Error al eliminar medicina del gato: " + error.message);
    }
  },

  async eliminarEnfermedadGato(req, res) {
    try {
      const id = parseInt(req.params.id); 
      const { enfermedad_id } = req.body;
      const user = req.session.user;

      const gato = await Gato.findByPk(id);
      if (!gato) {
        return res.status(404).json({ mensaje: "El gato no existe" });
      }
      if (user.refugio_id && gato.refugio_id != user.refugio_id) {
        return res.status(403).json({ mensaje: "No tienes permiso para modificar este gato" });
      }

   
      const relacion = await EnfermedadGato.findOne({
        where: { gato_id: id, enfermedad_id: enfermedad_id }
      });

      if (!relacion) {
        return res.status(404).json({ mensaje: "Esa enfermedad no está registrada en este gato" });
      }

      
      await relacion.destroy();
      return res.json({ mensaje: "Enfermedad eliminada del historial del gato" });

    } catch (error) {
      return res.status(500).send("Error al eliminar enfermedad del gato: " + error.message);
    }
  }

};