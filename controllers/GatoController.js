const Gato = require("../Models/Entes/Modelo_Gato");
const vw_GatosDatos=require("../Models/Vistas/vw_GatosDatos")
const vw_GatosMultimedia= require("../Models/Vistas/vw_GatosMultimedia")
const Foto = require("../Models/Datos/Modelo_Foto");
const DocumentoOficial = require("../Models/Datos/Modelo_DocumentoOficial");
const fs = require("fs");
const path = require("path");
const { Op, Sequelize } = require("sequelize");
const  sequelize  = require('../database'); 

module.exports = {



async listar(req, res) {
  try {
    const user = req.session.user; // Filtrar por refugio
   
    const gatosRaw = await sequelize.query(
      `SELECT g.id, g.nombre_gato, g.descripcion, mg.refugio_id, m.url
       FROM vw_GatosDatos g
       left JOIN vw_GatosMultimedia m ON g.id = m.gato_id
        JOIN Gato mg ON mg.id = g.id`,
      { type: sequelize.QueryTypes.SELECT }
    );

    const gatosMap = {};
    const gatos = [];
     console.log("gatosRaw longitud: ",gatosRaw.length);

    console.log("gatosRaw: ",gatosRaw);

    gatosRaw.forEach(row => {
      

      // Filtro por refugio
      const pertenece = !user.refugio_id || row.refugio_id == user.refugio_id;

      if (!pertenece) return;

      // Crear grupo del gato 
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

    res.render('voluntario/gatos', { gatos });
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
       WHERE  g.nombre_gato LIKE :nombre`,
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

      // Crear grupo del gato 
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

    res.render('voluntario/gatos', { gatos });
  } catch (error) {
    res.status(500).send("Error al obtener gatos: " + error.message);
  }
},


async listarEdadMenor(req, res) {
  try {
    const user = req.session.user; // Filtrar por refugio
   const edad=req.query.edad;
    const gatosRaw = await sequelize.query(
      `SELECT g.id, g.nombre_gato, g.descripcion, mg.refugio_id, m.url
       FROM vw_GatosDatos g
       LEFT JOIN vw_GatosMultimedia m ON g.id = m.gato_id
       JOIN Gato mg ON mg.id = g.id
       WHERE AND mg.edad<= :edad`,
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

      // Crear grupo del gato
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

    res.render('voluntario/gatos', { gatos });
  } catch (error) {
    res.status(500).send("Error al obtener gatos: " + error.message);
  }
},

async listarEdad(req, res) {
  try {
    const user = req.session.user;
   const edad=parseInt(req.query.edad);
    const gatosRaw = await sequelize.query(
      `SELECT g.id, g.nombre_gato, g.descripcion, mg.refugio_id, m.url
       FROM vw_GatosDatos g
       LEFT JOIN vw_GatosMultimedia m ON g.id = m.gato_id
       JOIN Gato mg ON mg.id = g.id
       WHERE mg.edad= :edad`,
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

    console.log("gatosRaw: ",gatosRaw);A

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

    res.render('voluntario/gatos', { gatos });
  } catch (error) {
    res.status(500).send("Error al obtener gatos: " + error.message);
  }
},

async listarEdadMayor(req, res) {
  try {
    const user = req.session.user; // Filtrar por refugio
   const edad=req.query.edad;
    const gatosRaw = await sequelize.query(
      `SELECT g.id, g.nombre_gato, g.descripcion, mg.refugio_id, m.url
       FROM vw_GatosDatos g
       LEFT JOIN vw_GatosMultimedia m ON g.id = m.gato_id
       JOIN Gato mg ON mg.id = g.id
       WHERE mg.edad>= :edad`,
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

    res.render('voluntario/gatos', { gatos });
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
       WHERE mg.id = :id`,
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

   
    res.render("voluntario/gato_detalles.ejs", { gatos });

  } catch (error) {
    res.status(500).send("Error al obtener gatos: " + error.message);
  }
},



  formulario(req, res) {
    user = req.session.user;
    res.render("voluntario/input_gato", {user});
  },

  async guardar(req, res) {
    try {
      const { nombre, refugioId, descripcion, temperamento, edad, raza  } = req.body;
      const estado= 'libre';
    const user = req.session.user;
    let refugio_id=refugioId;
      if(user.refugio_id){
        refugio_id=user.refugio_id;
      }

      await Gato.create({  
        nombre,
        refugio_id: parseInt(refugio_id),
        descripcion,
        temperamento,
        edad: parseInt(edad),
        raza,    
        estado
      });

      res.redirect("/voluntario/listar_gatos");
    } catch (error) {
      res.status(500).send("Error al guardar al gato: " + error.message);
    }
  },


// Mostrar formulario de modificación
async modificarFormulario(req, res) {
  try {
    const id  = parseInt(req.params.id);
    const gato = await Gato.findByPk(id);
    if (!gato) return res.status(404).send("Gato no encontrado");
    res.render("voluntario/modificar_gato", { gato,user:req.session.user });
  } catch (error) {
    res.status(500).send("Error al mostrar formulario de modificación: " + error.message);
  }
},

// Guardar cambios
async modificar(req, res) {
  try {
    const  id  = parseInt(req.params.id);
    console.log("ID A MODIFICAR: ",id);
    let { nombre, refugioId, temperamento, edad_gato, raza, descripcion } = req.body;
  const edad=parseInt(edad_gato);
    let refugio_id=refugioId;
    const user = req.session.user;

    if(user.refugio_id){
      refugio_id=user.refugio_id;
    }
    else{
      refugio_id=parseInt(refugioId);
    }

    await Gato.update(
      {nombre,refugio_id, temperamento, edad:parseInt(edad), raza, descripcion},
      { where: { id } }
    );
    res.redirect("/voluntario/modificar_gato_form/" + id);
  } catch (error) {
    res.status(500).send("Error al modificar gato: " + error.message);
  }
},

    
  async  subirFoto (req, res) {
  try {
    const { dueno_id } = req.body;

    if (!req.file) return res.status(400).send("No se envió ninguna imagen");

    const url = "uploads/" + req.file.filename;

    const gato=await Gato.findByPk(dueno_id);
    const user=req.session.user;
    const tipoEntidad="Gato";

    const pertenece= !user.refugio_id || gato.refugio_id==user.refugio_id;
    if(!pertenece) return res.status(403).send("No tiene permiso para subir foto a este gato");


    const nuevaFoto = await Foto.create({
      dueno_id: parseInt(dueno_id),
      tipoEntidad,
      urlImagen: url
    });

    res.json({
      mensaje: "Foto subida correctamente",
      data: nuevaFoto
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error al subir foto");
  }
},



async borrarFoto(req, res) {
  try {
    const  dueno_id   = parseInt(req.body.dueno_id); 
    const indice = parseInt(req.body.indice);// indice
    const tipoEntidad = "Gato";
    const user = req.session.user;

    // Validar gato
    const gato = await Gato.findByPk(dueno_id);
    if (!gato) return res.status(404).send("Gato no encontrado");

    // Validar permisos
    const pertenece = !user.refugio_id || gato.refugio_id == user.refugio_id;
    if (!pertenece)
      return res.status(403).send("No tiene permiso para borrar foto de este gato");

    // Buscar  las fotos del gato
    const fotos = await Foto.findAll({
      where: { dueno_id, tipoEntidad },
      order: [["id", "ASC"]] //ordenarlas
    });

    if (fotos.length === 0)
      return res.status(404).send("Este gato no tiene fotos");

    // Validar índice
    const pos = Number(indice) - 1; // convertir a índice de arreglo
    if (pos < 0 || pos >= fotos.length)
      return res.status(400).send("El índice de foto no existe");

    // Foto a borrar
    const foto = fotos[pos];

    // Borrar archivo físico
    const ruta = path.join(__dirname, "..", foto.urlImagen);
    fs.unlink(ruta, err => {
      if (err) console.warn("No se pudo borrar el archivo físico:", err);
    });

    // Borrar de la base
    await foto.destroy();

      //Borrar de uploads
    const uploadPath = path.join(__dirname, "..", "uploads", path.basename(foto.urlImagen));
    fs.unlink(uploadPath, err => {
      if (err) console.warn("No se pudo borrar el archivo de uploads:", err);
    });

    res.json({
      mensaje: "Foto eliminada correctamente",
      fotoEliminada: foto.id
    });

  } catch (error) {
    console.error(error);
    res.status(500).send("Error al borrar foto");
  }
},


    
async subirDocumento (req, res)  {
  
  try {
    const {
      dueno_id,
      nombre_dueno,
      descripcion,
      fecha_emision
    } = req.body;

    if (!req.file) return res.status(400).send("No se envió ningún archivo");

    const url = "uploads/" + req.file.filename;

    const gato=await Gato.findByPk(dueno_id);
    const user=req.session.user;
    const tipoEntidad="Gato";

    const pertenece= !user.refugio_id || gato.refugio_id==user.refugio_id;
    if(!pertenece) return res.status(403).send("No tiene permiso para subir foto a este gato");


    const documento = await DocumentoOficial.create({
      dueno_id: parseInt(dueno_id),
      nombre_dueno,
      descripcion,
      fecha_emision,
      fecha_subida: new Date(),
      tipoEntidad,
      url
    });

    res.json({
      mensaje: "Documento subido correctamente",
      data: documento
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error al subir documento");
  }
},


async borrarDocumento(req, res) {
  try {
    const  dueno_id   = parseInt(req.body.dueno_id); 
    const indice = parseInt(req.body.indice);// 
    const user = req.session.user;
    tipoEntidad="Gato"
    // Validación tipoEntidad
    if (!["Gato", "Usuario", "Refugio", "UsoDonacion"].includes(tipoEntidad)) {
      return res.status(400).send("tipoEntidad inválido");
    }

   
      const gato = await Gato.findByPk(dueno_id);
      if (!gato) return res.status(404).send("Gato no encontrado");

      const pertenece = !user.refugio_id || gato.refugio_id == user.refugio_id;
      if (!pertenece)
        return res.status(403).send("No tiene permiso para borrar documento de este gato");
    

    // Buscar documentos 
    const docs = await DocumentoOficial.findAll({
      where: { dueno_id, tipoEntidad },
      order: [["id", "ASC"]] 
    });

    if (docs.length === 0)
      return res.status(404).send("Este dueño no tiene documentos");

 
    const pos = Number(indice) - 1;
    if (pos < 0 || pos >= docs.length)
      return res.status(400).send("El índice solicitado no existe");

    // Documento a borrar
    const doc = docs[pos];

    // Borrar archivo físico
    const ruta = path.join(__dirname, "..", doc.url);
    fs.unlink(ruta, err => {
      if (err) console.warn("No se pudo borrar el archivo físico:", err);
    });

    // Borrar registro en la base
    await doc.destroy();

    //Borrar de uploads 
    const uploadPath = path.join(__dirname, "..", "uploads", path.basename(doc.url));
    fs.unlink(uploadPath, err => {
      if (err) console.warn("No se pudo borrar el archivo de uploads:", err);
    }
    );

    res.json({
      mensaje: "Documento eliminado correctamente",
      documentoEliminado: doc.id
    });

  } catch (error) {
    console.error(error);
    res.status(500).send("Error al borrar documento: "+error.message);
  }
}



};
