
const vw_GatosDatos=require("../Models/Vistas/vw_GatosDatos")
const vw_GatosMultimedia= require("../Models/Vistas/vw_GatosMultimedia")
const { Op, Sequelize } = require("sequelize");
const  sequelize  = require('../database'); 
const Usuario = require("../Models/Entes/Modelo_Usuario");
const UsuarioRol=require("../Models/Entes/Modelo_UsuarioRol")
const Adopcion=require("../Models/Procesos/Modelo_Adopcion")
const Gato=require("../Models/Entes/Modelo_Gato");
const { DateTime } = require("mssql");
const { rechazarUsuario } = require("./TrabajadorController");

module.exports = {

async listar(req, res) {
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

    res.render('usuario/gatos', { gatos });
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

    res.render('usuario/gatos', { gatos });
  } catch (error) {
    res.status(500).send("Error al obtener gatos: " + error.message);
  } 
},


async listarEdadMenor(req, res) {
  try {
    const user = req.session.user; 
   const edad=req.query.edad;
    const gatosRaw = await sequelize.query(
      `SELECT g.id, g.nombre_gato, g.descripcion, mg.refugio_id, m.url
       FROM vw_GatosDatos g
       LEFT JOIN vw_GatosMultimedia m ON g.id = m.gato_id
       JOIN Gato mg ON mg.id = g.id
       WHERE m.tipo_archivo = 'foto'AND mg.edad<= :edad 
       and (mg.estado = 'libre' OR mg.estado = 'proceso')`,
      {
        type: sequelize.QueryTypes.SELECT,
        replacements: {
          edad: edad
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

    res.render('usuario/gatos', { gatos });
  } catch (error) {
    res.status(500).send("Error al obtener gatos: " + error.message);
  }
},

async listarEdad(req, res) {
  try {
    const user = req.session.user; //Filtrar por refugio
   const edad=parseInt(req.query.edad);
    const gatosRaw = await sequelize.query(
      `SELECT g.id, g.nombre_gato, g.descripcion, mg.refugio_id, m.url
       FROM vw_GatosDatos g
       LEFT JOIN vw_GatosMultimedia m ON g.id = m.gato_id
       JOIN Gato mg ON mg.id = g.id
       WHERE m.tipo_archivo = 'foto'AND mg.edad= :edad 
       and (mg.estado = 'libre' OR mg.estado = 'proceso')`,
      {
        type: sequelize.QueryTypes.SELECT,
        replacements: {
          edad: edad
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

    res.render('usuario/gatos', { gatos });
  } catch (error) {
    res.status(500).send("Error al obtener gatos: " + error.message);
  }
},

async listarEdadMayor(req, res) {
  try {
    const user = req.session.user; 
   const edad=req.query.edad;
    const gatosRaw = await sequelize.query(
      `SELECT g.id, g.nombre_gato, g.descripcion, mg.refugio_id, m.url
       FROM vw_GatosDatos g
       LEFT JOIN vw_GatosMultimedia m ON g.id = m.gato_id
       JOIN Gato mg ON mg.id = g.id
       WHERE m.tipo_archivo = 'foto'AND mg.edad>= :edad
       and (mg.estado = 'libre' OR mg.estado = 'proceso')`,
      {
        type: sequelize.QueryTypes.SELECT,
        replacements: {
          edad: edad
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
 
      if (row.url) {
        gatosMap[row.id].vw_GatosMultimedia.push({ url: row.url });
      }
    });
console.log("GATOS A ENVIAR A LA VISTA:", gatos);

    res.render('usuario/gatos', { gatos });
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

      if (row.url) {
        if (row.tipo_archivo === "foto") {
          gatosMap[row.id].fotos.push({ url: row.url });
        } else if (row.tipo_archivo === "documento") {
          gatosMap[row.id].documentos.push({ url: row.url });
        }
      }
    });

   
    res.render("usuario/gato_detalles.ejs", { gatos });

  } catch (error) {
    res.status(500).send("Error al obtener gatos: " + error.message);
  }
},



async adoptar(req,res){
  try{
    const user=req.session.user;
    const gato_id= parseInt(req.params.id);
    const usuario_id= user.id;
    const estado='proceso';

    const gato= await Gato.findByPk(gato_id);

    const adopcion= await Adopcion.create ({
      usuario_id,
      gato_id,
      refugio_id:gato.refugio_id,
      estado : 'proceso'
    });

      res.json({
      mensaje: "Solicitud adopción enviada",
     adopcion:adopcion
    });

  }
catch (error){
  res.status(500).send("Error de crear soliciturd: "+error.message);
}
},

async listarAdopcionesProceso(req,res){
      try{
        const user = req.session.user;
        const refugio_id=user.refugio_id;
        let adopciones= []
        const estado='proceso';

        if(!user.refugio_id) {
           adopciones= await Adopcion.findAll({where:{estado},order:[["id_adopcion","ASC"]]});
        }

        else{
           adopciones=await Adopcion.findAll({where:{refugio_id,estado},order:[["id_adopcion","ASC"]]});
        }
    
        res.render('trabajador/adopciones',{adopciones});
      } 
      catch(error){
         res.status(500).send("Error al mostrar las adopciones: " + error.message);

      }
    },
        
  async listarAdopcionesHechas(req,res){
      try{
        const user = req.session.user;
        const refugio_id=user.refugio_id;
        let adopciones= []
        const estado='adoptado'


        if(!user.refugio_id) {
           adopciones= await Adopcion.findAll({where:{estado},order:[["id_adopcion","ASC"]]})
        }
        else{
           adopciones=await Adopcion.findAll({where:{refugio_id,estado},order:[["id_adopcion","ASC"]]})
        }
    
        res.render('trabajador/adopciones',{adopciones});
       

      } 
      catch (error){
         res.status(500).send("Error al mostrar las adopciones: " + error.message);

      }
    },

    async listarAdopcionesRechazadas(req,res){
      try{
        const user = req.session.user;
        const refugio_id=user.refugio_id;
        let adopciones= []
        const estado='libre'


        if(!user.refugio_id) {
           adopciones= await Adopcion.findAll({where:{estado},order:[["id_adopcion","ASC"]]})
        }
        else{
           adopciones=await Adopcion.findAll({where:{refugio_id,estado},order:[["id_adopcion","ASC"]]})
        }
    
        res.render('trabajador/adopciones',{adopciones});
       

      } 
      catch(error){
         res.status(500).send("Error al mostrar las adopciones: " + error.message);
      }
    },

    async listarAdopcionUsuario(req,res){
      try{
        const user_id=req.query.id;
        const user = req.session.user;
        const refugio_id=user.refugio_id;
        
        let adopciones= []
      
        if(!user.refugio_id ) {
           adopciones= await Adopcion.findAll({where: {usuario_id:user_id}, order:[["id_adopcion","ASC"]]});
        }
        else{
          
           adopciones=await Adopcion.findAll({where:{usuario_id:user_id,refugio_id:refugio_id},order:[["id_adopcion","ASC"]]});
        }

        res.render('trabajador/adopciones',{adopciones});
       
      } 
      catch(error){
         res.status(500).send("Error al mostrar las adopciones: " + error.message);
      }
    },

    async mostrarAdopcion(req,res){
      try{
        const adopcion_id=parseInt(req.params.adopcion_id);
        const estado=req.params.estado;
        const user = req.session.user;
        if(!adopcion_id){
          res.json({mensaje:"No hay id de adopción"});
        }
        const adopcion = await Adopcion.findOne({where:{adopcion_id:adopcion_id,estado:estado}})
        if(adopcion.refugio_id!=user.refugio_id&&user.refugio){
          res.json({mensaje:"No tiene permiso para ver esta adopción"});
        }

         res.render('trabajador/adopcion_detalles',{adopcion});

      }
      catch (error){
          res.status(500).send("Error al mostrar las adopcion: " + error.message);
      }

    },

    async aceptarAdopcion (req,res){
        try{
            const user = req.session.user;
            const fecha_adopcion = new Date();
            const adopcion_id=req.params.id;
            const estado = 'adoptado';
            
            const trabajador_id = user.id;

            const adopcion= await Adopcion.findByPk(adopcion_id);

            if (adopcion.refugio_id!=user.refugio_id && user.refugio_id){
              res.json({mensaje:"No tiene permiso para aceptar esta adopción"});
            }

            const [updatedRows]= await Adopcion.update(
                  { estado,fecha_adopcion,trabajador_id},
                  {where: {id_adopcion:adopcion_id}}
            );

            if (updatedRows===0){
                return res.status(404).send("No se encontró la adopción.");
            }

             res.json({ mensaje: "Adopción completada" });

        }
        catch (error){
          res.status(500).send("Error al completar la adopción " + error.message);
        }
    },

        async rechazarAdopcion (req,res){
        try{
            const user = req.session.user;
            const fecha_adopcion = new Date();
            const adopcion_id=req.params.id;
            const estado = 'libre';
            
            const trabajador_id = user.id;

            const adopcion= await Adopcion.findByPk(adopcion_id);

            if (adopcion.refugio_id!=user.refugio_id && user.refugio_id){
              res.json({mensaje:"No tiene permiso para rechazar esta adopción"});
            }

            const [updatedRows]= await Adopcion.update(
                  { estado,fecha_adopcion,trabajador_id},
                  {where: {id_adopcion:adopcion_id}}
            );

            if (updatedRows===0){
                return res.status(404).send("No se encontró la adopción.");
            }

             res.json({ mensaje: "Adopción completada" });

        }
        catch (error){
          res.status(500).send("Error al completar la adopción " + error.message);
        }

    },


        async listarAdopcionUsuario_Adop(req,res){
      try{
        
        const user = req.session.user;
        let adopciones= []
        const user_id=user.id;
       
      
        adopciones= await Adopcion.findAll({where: {usuario_id:user_id}, order:[["id_adopcion","ASC"]]});

        res.render('usuario/adopciones',{adopciones});
       
      } 
      catch (error){
         res.status(500).send("Error al mostrar las adopciones: " + error.message);

      }
    },
    async mostrarAdopcion(req,res){
      try{
        const adopcion_id=parseInt(req.params.adopcion_id);
        const user = req.session.user;
        if(!adopcion_id){
          res.json({mensaje:"No hay id de adopción"});
        }
        const adopcion = await Adopcion.findOne({where:{adopcion_id:adopcion_id}})
        if(adopcion.refugio_id!=user.refugio_id&&user.refugio){
          res.json({mensaje:"No tiene permiso para ver esta adopción"});
        }

         res.render('usuario/adopcion_detalles',{adopcion});

      }
      catch (error){
          res.status(500).send("Error al mostrar las adopcion: " + error.message);
      }

    },

};
