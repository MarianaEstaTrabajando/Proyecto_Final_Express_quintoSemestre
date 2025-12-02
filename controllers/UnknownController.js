const Usuario = require("../Models/Entes/Modelo_Usuario");
const UsuarioRol = require("../Models/Entes/Modelo_UsuarioRol");
const Foto = require("../Models/Datos/Modelo_Foto");
const DocumentoOficial = require("../Models/Datos/Modelo_DocumentoOficial");
const Direccion = require("../Models/Datos/Modelo_Direccion");
const NumeroCel_Tel = require("../Models/Datos/Modelo_NumeroCel_Tel");
const fs = require("fs");
const path = require("path");
const { Op, Sequelize } = require("sequelize");
const sequelize = require('../database');

module.exports = {

  async listar(req, res) {
  try {
    
   
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

    res.render('index', { gatos });
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
       WHERE m.tipo_archivo = 'foto'AND g.nombre_gato LIKE :nombre and (mg.estado = 'libre' OR mg.estado = 'proceso')`,
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

    res.render('index', { gatos });
  } catch (error) {
    res.status(500).send("Error al obtener gatos: " + error.message);
  }
},


async listarEdadMenor(req, res) {
  try {
   const edad=req.query.edad;
    const gatosRaw = await sequelize.query(
      `SELECT g.id, g.nombre_gato, g.descripcion, mg.refugio_id, m.url
       FROM vw_GatosDatos g
       LEFT JOIN vw_GatosMultimedia m ON g.id = m.gato_id
       JOIN Gato mg ON mg.id = g.id
       WHERE m.tipo_archivo = 'foto'AND mg.edad<= :edad and (mg.estado = 'libre' OR mg.estado = 'proceso')`,
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

    res.render('index', { gatos });
  } catch (error) {
    res.status(500).send("Error al obtener gatos: " + error.message);
  }
},

async listarEdad(req, res) {
  try {
   const edad=parseInt(req.query.edad);
    const gatosRaw = await sequelize.query(
      `SELECT g.id, g.nombre_gato, g.descripcion, mg.refugio_id, m.url
       FROM vw_GatosDatos g
       LEFT JOIN vw_GatosMultimedia m ON g.id = m.gato_id
       JOIN Gato mg ON mg.id = g.id
       WHERE m.tipo_archivo = 'foto'AND mg.edad= :edad and (mg.estado = 'libre' OR mg.estado = 'proceso')`,
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


    gatosRaw.forEach(row => {
      
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

    res.render('index', { gatos });
  } catch (error) {
    res.status(500).send("Error al obtener gatos: " + error.message);
  }
},

async listarEdadMayor(req, res) {
  try {
   const edad=req.query.edad;
    const gatosRaw = await sequelize.query(
      `SELECT g.id, g.nombre_gato, g.descripcion, mg.refugio_id, m.url
       FROM vw_GatosDatos g
       LEFT JOIN vw_GatosMultimedia m ON g.id = m.gato_id
       JOIN Gato mg ON mg.id = g.id
       WHERE m.tipo_archivo = 'foto'AND mg.edad>= :edad and (mg.estado = 'libre' OR mg.estado = 'proceso')`,
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

    res.render('index', { gatos });
  } catch (error) {
    res.status(500).send("Error al obtener gatos: " + error.message);
  }
},

async listarId(req, res) {
  try {
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

    res.render("gato_detalles.ejs", { gatos });

  } catch (error) {
    res.status(500).send("Error al obtener gatos: " + error.message);
  }
},

  formulario(req, res) {
   
    res.render("input_adoptante");
  },


  async guardar(req, res) {
    try {
        let { nombre, apellido1, apellido2, edad, usuario, contrasena } = req.body;
        edad = parseInt(edad);
        const user = req.session.user;

      
        if(!apellido2){
            apellido2=null;
        }

       
        const Adoptante = await Usuario.create({
            nombre,
            apellido1,
            apellido2,
            edad,
            usuario,
            contrasena
        });
  
        const usuario_creado=await UsuarioRol.create({
            usuario_id: Adoptante.id,
            rol_id: 6,
            refugio_id: null,
            estado_usuario: 'proceso',
            documentos_completos: 0,
            
        });
        
       res.render("modificar_adoptante", {usuario:Adoptante});
    } catch (error) {
      
        res.status(500).send("Error al guardar adoptante: " + error.message);
    }
},
async subirDireccion(req, res) {
    try{
        const {direccion,usuario_id} = req.body;
        const tipoEntidad = "Usuario";
        const user = req.session.user;
        
        if(!direccion || direccion.trim() === ""){
            return res.status(400).send("Dirección inválida");
        }

        const usuarioRol = await UsuarioRol.findOne({
         where: { usuario_id: usuario_id }
        });

        if(!usuarioRol){
            return res.status(404).send("Usuario no encontrado");
        }

     
        if(usuarioRol.rol_id !=6){
            return res.status(403).send("El usuario no es un adoptante");
        }


        const nuevaDireccion = await Direccion.create({
            dueno_id: parseInt(usuario_id),
            direccion:direccion,
            tipoEntidad:tipoEntidad
        });

        res.json({mensaje: "Dirección agregada", data: nuevaDireccion});
    }
    catch(error){
        res.status(500).send("Error al agregar dirección: " + error.message);
    }
},


async subirTelefono(req, res) {
    try{
        const {numero,usuario_id} = req.body;
        const tipoEntidad = "Usuario";
        const user = req.session.user;
        console.log("Número recibido:",numero);
        if(!numero || numero.trim() === ""){
            return res.status(400).send("Número inválido");
        }
        const usuarioRol = await UsuarioRol.findOne({
            where: { usuario_id: usuario_id }
                });
        if(!usuarioRol){
            return res.status(404).send("Usuario no encontrado");
        }
        if(usuarioRol.rol_id !=6){
            return res.status(403).send("El usuario no es un adoptante");
        }
       
        const nuevoTelefono = await NumeroCel_Tel.create({
            dueno_id: parseInt(usuario_id),
            celular:numero,
            tipoEntidad:tipoEntidad
        });
        res.json({mensaje: "Teléfono agregado", data: nuevoTelefono});
    }
    catch(error){
        res.status(500).send("Error al agregar teléfono: " + error.message);
    }
},

    async subirFoto(req, res) {
        try {
            const { dueno_id } = req.body;
            const user = req.session.user;
            console.log("Dueño ID:", dueno_id);

            if (!req.file) return res.status(400).send("No se envió ninguna imagen");

            if (!dueno_id) return res.status(400).send("ID de usuario requerido");

            const whereClause = { usuario_id: dueno_id };

         
            const usuarioRol = await UsuarioRol.findOne({ where: whereClause });
            if (!usuarioRol) {
                return res.status(404).send("No se encontró la relación Usuario-Refugio para aprobar.");
            }
          
            if(usuarioRol.rol_id !=6){
                return res.status(403).send("El usuario no es un adoptante");
            }

            const url = "uploads/" + req.file.filename;
            const tipoEntidad = "Usuario";

            const nuevaFoto = await Foto.create({
                dueno_id: parseInt(dueno_id),
                tipoEntidad,
                urlImagen: url
            });

            res.json({ mensaje: "Foto subida correctamente", data: nuevaFoto });
        } catch (error) {
            res.status(500).send("Error al subir foto: "+error.message);
        }
    },

   
    async subirDocumento(req, res) {
        try {
            const { dueno_id, nombre_dueno, descripcion, fecha_emision } = req.body;

            if (!req.file) return res.status(400).send("No se envió archivo");
            if (!dueno_id) return res.status(400).send("ID de usuario requerido");
            const user=req.session.user;

            const whereClause = { usuario_id: dueno_id };

         

            const usuarioRol = await UsuarioRol.findOne({ where: whereClause });
            if (!usuarioRol) {
                return res.status(404).send("No se encontró la relación Usuario-Refugio para aprobar.");
            }
           
            if(usuarioRol.rol_id !=6){
                return res.status(403).send("El usuario no es un adoptante");
            }

            const url = "uploads/" + req.file.filename;
            const tipoEntidad = "Usuario";

            const documento = await DocumentoOficial.create({
                dueno_id: parseInt(dueno_id),
                nombre_dueno,
                descripcion,
                fecha_emision,
                fecha_subida: new Date(),
                tipoEntidad,
                url
            });
            
            res.json({ mensaje: "Documento subido", data: documento });
        } catch (error) {
            res.status(500).send("Error al subir documento: "+error.message);
        }
    },


};