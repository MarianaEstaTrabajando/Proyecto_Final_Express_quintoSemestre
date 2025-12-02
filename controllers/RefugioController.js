const Refugio = require("../Models/Entes/Modelo_Refugio"); // Asumiendo que existe el modelo base
const Foto = require("../Models/Datos/Modelo_Foto");
const DocumentoOficial = require("../Models/Datos/Modelo_DocumentoOficial");
const Auditoria=require("../Models/Procesos/Modelo_Auditoria");
const UsuarioRol=require("../Models/Entes/Modelo_UsuarioRol");
const Usuario=require("../Models/Entes/Modelo_Usuario");
const fs = require("fs");
const path = require("path");
const { Op, Sequelize } = require("sequelize");
const sequelize = require('../database');
const { request } = require("http");

module.exports = {

  async listar(req, res) {
    try {
    
      const refugiosRaw = await sequelize.query(
        `SELECT r.id, r.nombre_refugio, r.descripcion, r.cantidad_gatos, r.prioridad, m.url, r.tiempo_existencia, r.fondos_actuales
         FROM vw_RefugiosDatos r
         LEFT JOIN vw_RefugiosMultimedia m ON r.id = m.refugio_id AND m.tipo_archivo = 'foto'`,
        { type: sequelize.QueryTypes.SELECT }
      );

      const refugiosMap = {};
      const refugios = [];

      console.log("refugiosRaw longitud: ", refugiosRaw.length);

      refugiosRaw.forEach(row => {
    
        if (!refugiosMap[row.id]) {
          refugiosMap[row.id] = {
            id: row.id,
            nombre: row.nombre_refugio, 
            descripcion: row.descripcion,
            cantidad_gatos: row.cantidad_gatos,
            prioridad: row.prioridad,
            tiempo_existencia:row.tiempo_existencia,
            fondos_actuales:row.fondos_actuales,
            fotos: []
          };
          refugios.push(refugiosMap[row.id]);
        }

        if (row.url) {
          refugiosMap[row.id].fotos.push({ url: row.url });
        }
      });

      console.log("REFUGIOS A ENVIAR A LA VISTA:", refugios);

      res.render('admin/refugios', { refugios });

    } catch (error) {
      res.status(500).send("Error al obtener refugios: " + error.message);
    }
  },

async listarId(req, res) {
    try {
      const id = parseInt(req.query.id);
      
      const refugiosRaw = await sequelize.query(
        `SELECT r.id, r.nombre_refugio, r.descripcion, r.cantidad_gatos, 
                r.tiempo_existencia, r.fondos_actuales, r.prioridad, 
                r.direccion, r.telefono_contacto, r.personal,
                m.url, m.tipo_archivo, m.descripcion as descripcion_archivo
         FROM vw_RefugiosDatos r
         LEFT JOIN vw_RefugiosMultimedia m ON r.id = m.refugio_id
         WHERE r.id = :id`,
        {
          type: sequelize.QueryTypes.SELECT,
          replacements: { id }
        }
      );
  
      const refugiosMap = {};
      const refugiosArr = []; 
  
      refugiosRaw.forEach(row => {
    
        if (!refugiosMap[row.id]) {
          refugiosMap[row.id] = {
            id: row.id,
            fotos: [],       
            documentos: [],
         
            nombre: row.nombre_refugio, 
            descripcion: row.descripcion,
            cantidad_gatos: row.cantidad_gatos,
            tiempo_existencia: row.tiempo_existencia,
            fondos_actuales: row.fondos_actuales,
            prioridad: row.prioridad,
            direccion: row.direccion,
            telefonoContacto: row.telefono_contacto,
            personal: row.personal
          };
          refugiosArr.push(refugiosMap[row.id]);
        }
  
        if (row.url) {
          if (row.tipo_archivo === "foto") {
          
            refugiosMap[row.id].fotos.push({ urlImagen: row.url }); 
          } else if (row.tipo_archivo === "documento") {
            refugiosMap[row.id].documentos.push({ 
                url: row.url,
                descripcion: row.descripcion_archivo 
            });
          }
        }
      });
  
      if (refugiosArr.length > 0) {
        const refugioEncontrado = refugiosArr[0];
        
    
        console.log("Objeto Refugio enviado a la vista:", JSON.stringify(refugioEncontrado, null, 2));

        res.render("admin/refugio_detalles.ejs", { refugio: refugioEncontrado });
      } else {
        res.status(404).send("Refugio no encontrado");
      }
  
    } catch (error) {
      console.error(error); 
      res.status(500).send("Error al obtener detalles del refugio: " + error.message);
    }
  },


  formulario(req, res) {
    const user = req.session.user;
    res.render("admin/input_refugio", { user });
  },

  async guardar(req, res) {
    try {
  
      const { nombre, descripcion, cantidad_gatos, tiempo_existencia, fondos_actuales } = req.body;
     
      await Refugio.create({
        nombre,
        descripcion,
        cantidad_gatos: parseInt(cantidad_gatos),
        tiempo_existencia: parseInt(tiempo_existencia),
        fondos_actuales: parseFloat(fondos_actuales)
      });

      res.redirect("/admin/listar_refugios");
    } catch (error) {
      res.status(500).send("Error al guardar el refugio: " + error.message);
    }
  },

  async modificarFormulario(req, res) {
    try {
      const id = parseInt(req.params.id);
      const refugio = await Refugio.findByPk(id);
      const user = req.session.user;

      if (!refugio) return res.status(404).send("Refugio no encontrado");

      const pertenece = !user.refugio_id || refugio.id == user.refugio_id;
      if (!pertenece) return res.status(403).send("No tiene permiso para editar este refugio");

      res.render("admin/modificar_refugio", { refugio, user });
    } catch (error) {
      res.status(500).send("Error al mostrar formulario de modificación: " + error.message);
    }
  },

  async modificar(req, res) {
    try {
      const id = parseInt(req.params.id);
      const { nombre, descripcion, cantidad_gatos, tiempo_existencia, fondos_actuales } = req.body;
      const user = req.session.user;

      const refugioActual = await Refugio.findByPk(id);
      if (!refugioActual) return res.status(404).send("Refugio no encontrado");

      const pertenece = !user.refugio_id || refugioActual.id == user.refugio_id;
      if (!pertenece) return res.status(403).send("No tiene permiso para modificar este refugio");

      await Refugio.update(
        { 
          nombre, 
          descripcion, 
          cantidad_gatos: parseInt(cantidad_gatos), 
          tiempo_existencia: parseInt(tiempo_existencia), 
          fondos_actuales: parseFloat(fondos_actuales) 
        },
        { where: { id } }
      );

      res.redirect("/admin/modificar_refugio_form/" + id);
    } catch (error) {
      res.status(500).send("Error al modificar refugio: " + error.message);
    }
  },

  async subirFoto(req, res) {
    try {
      const { dueno_id } = req.body;

      if (!req.file) return res.status(400).send("No se envió ninguna imagen");

      const url = "uploads/" + req.file.filename;

      // Validar permisos
      const refugio = await Refugio.findByPk(dueno_id);
      if (!refugio) return res.status(404).send("Refugio no encontrado");

      const user = req.session.user;
      const tipoEntidad = "Refugio";

      const pertenece = !user.refugio_id || refugio.id == user.refugio_id;
      if (!pertenece) return res.status(403).send("No tiene permiso para subir foto a este refugio");

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
      const dueno_id = parseInt(req.body.dueno_id); 
      const indice = parseInt(req.body.indice);
      const tipoEntidad = "Refugio";
      const user = req.session.user;

      const refugio = await Refugio.findByPk(dueno_id);
      if (!refugio) return res.status(404).send("Refugio no encontrado");

      const pertenece = !user.refugio_id || refugio.id == user.refugio_id;
      if (!pertenece) return res.status(403).send("No tiene permiso para borrar foto de este refugio");

      const fotos = await Foto.findAll({
        where: { dueno_id, tipoEntidad },
        order: [["id", "ASC"]]
      });

      if (fotos.length === 0) return res.status(404).send("Este refugio no tiene fotos");

      const pos = Number(indice) - 1;
      if (pos < 0 || pos >= fotos.length) return res.status(400).send("El índice de foto no existe");

      const foto = fotos[pos];

      // Borrar archivo 
      const ruta = path.join(__dirname, "..", foto.urlImagen);
      fs.unlink(ruta, err => {
        if (err) console.warn("No se pudo borrar el archivo físico:", err);
      });

      const uploadPath = path.join(__dirname, "..", "uploads", path.basename(foto.urlImagen));
       fs.unlink(uploadPath, err => {
        if (err) console.warn("No se pudo borrar el archivo de uploads:", err);
      });

      await foto.destroy();

      res.json({
        mensaje: "Foto eliminada correctamente",
        fotoEliminada: foto.id
      });

    } catch (error) {
      console.error(error);
      res.status(500).send("Error al borrar foto");
    }
  },

  async subirDocumento(req, res) {
    try {
      const {
        dueno_id, 
        nombre_dueno, 
        descripcion,
        fecha_emision
      } = req.body;

      if (!req.file) return res.status(400).send("No se envió ningún archivo");

      const url = "uploads/" + req.file.filename;

      const refugio = await Refugio.findByPk(dueno_id);
      if (!refugio) return res.status(404).send("Refugio no encontrado");

      const user = req.session.user;
      const tipoEntidad = "Refugio"; 

      const pertenece = !user.refugio_id || refugio.id == user.refugio_id;
      if (!pertenece) return res.status(403).send("No tiene permiso para subir documento a este refugio");

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
      const dueno_id = parseInt(req.body.dueno_id);
      const indice = parseInt(req.body.indice);
      const user = req.session.user;
      const tipoEntidad = "Refugio";

      const refugio = await Refugio.findByPk(dueno_id);
      if (!refugio) return res.status(404).send("Refugio no encontrado");

      const pertenece = !user.refugio_id || refugio.id == user.refugio_id;
      if (!pertenece) return res.status(403).send("No tiene permiso para borrar documento de este refugio");

      const docs = await DocumentoOficial.findAll({
        where: { dueno_id, tipoEntidad },
        order: [["id", "ASC"]]
      });

      if (docs.length === 0) return res.status(404).send("Este refugio no tiene documentos");

      const pos = Number(indice) - 1;
      if (pos < 0 || pos >= docs.length) return res.status(400).send("El índice solicitado no existe");

      const doc = docs[pos];

      const ruta = path.join(__dirname, "..", doc.url);
      fs.unlink(ruta, err => {
        if (err) console.warn("No se pudo borrar el archivo físico:", err);
      });
      
      const uploadPath = path.join(__dirname, "..", "uploads", path.basename(doc.url));
      fs.unlink(uploadPath, err => {
        if (err) console.warn("No se pudo borrar el archivo de uploads:", err);
      });

      await doc.destroy();

      res.json({
        mensaje: "Documento eliminado correctamente",
        documentoEliminado: doc.id
      });

    } catch (error) {
      console.error(error);
      res.status(500).send("Error al borrar documento: " + error.message);
    }
  },

   async mostrarAuditorias(req,res){
        try{
            const user=req.session.user;
            const refugio_id=user.refugio_id;
            let auditorias;
            if(user.refugio_id){
             auditorias = await sequelize.query(
                
                `SELECT * from Auditoria a LEFT JOIN Usuario u on a.usuario=u.id where u.refugio_id=:refugio_id`,
                 {
                    type: sequelize.QueryTypes.SELECT,
                    replacements: { refugio_id: {refugio_id} }
                }
            );}
            else{
                auditorias=await Auditoria.findAll({
                    order:[['id', 'DESC']]
                });
            }

             return res.render("admin_refugio/auditorias", { auditorias });
        }
    catch(error){
    res.json({mensaje:"No se lograron encontrar las auditorías :C"})
    }
    },

    
    async elegirRefugio(req,res){
        try{
        const refugio_id=req.body.refugio_id;
        const refugios= await Refugio.findAll();
        let bandera=false;
        refugios.forEach(refugio=>{
          if(refugio_id==refugio.id){
            bandera=true;
          }
        } );
         if(bandera){
          req.session.user.refugio_id=refugio_id;
          res.json({message:"Se cambió el refugio al indicado"});
        }
        else{
        if(refugio_id==0){
          req.session.user.refugio_id=null;
          res.json({message:"Se cambió la configuración a global"});
        }
        else{

           res.json({message:"No existe esa opción"});
        }
        
      }

        }
        catch(error){
           res.status(500).send("Error al escoger refugio "+error.message); 
        }
    },
 
    async eliminarUsuarioForm(req,res){
      res.render("eliminar_usuario");
    },
    async eliminarUsuario (req,res){
        try{
            const id=req.body.id
            user=req.session.user;
            const usuarioRol= await UsuarioRol.findOne({where:{usuario_id:id}})
            const usuario= await Usuario.findByPk(id)

              if (!usuario || !usuarioRol) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }

            if(user.rol=='Admin'){
                await usuarioRol.destroy();
                await usuario.destroy();
            
            }
            if(user.rol=='Admin_Refugio'){
                if(usuarioRol.rol_id!=1&&usuarioRol.rol_id!=2&& usuarioRol.refugio_id==user.refugio_id){
                   await usuarioRol.destroy();
                    await usuario.destroy();
                }
            }
            if(user.rol=='Trabajador'){
                if(usuarioRol.rol_id!=1&&usuarioRol.rol_id!=2&& usuarioRol.rol_id!=3
                     &&usuarioRol.refugio_id==user.refugio_id){
                   await usuarioRol.destroy();
                   await usuario.destroy();
                }
            }

    res.json({message:"Se destruyó el usuario"})
        }
    catch (error){
    res.status(500).send("Error al borrar usuario: "+error.message);
    }
    
    },

};