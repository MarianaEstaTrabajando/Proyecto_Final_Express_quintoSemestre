const Usuario = require("../Models/Entes/Modelo_Usuario");
const UsuarioRol = require("../Models/Entes/Modelo_UsuarioRol"); // Necesario para aprobar
const Foto = require("../Models/Datos/Modelo_Foto");
const DocumentoOficial = require("../Models/Datos/Modelo_DocumentoOficial");
const Direccion = require("../Models/Datos/Modelo_Direccion"); // Modelo para direcciones
const NumeroCel_Tel = require("../Models/Datos/Modelo_NumeroCel_Tel"); // Modelo para teléfonos
const fs = require("fs");
const path = require("path");
const { Op, Sequelize } = require("sequelize");
const sequelize = require('../database');

module.exports = {

    
    async listar(req, res) {
        try {
            const user = req.session.user; 
           
            const usuariosRaw = await sequelize.query(
                `SELECT u.*, m.url, ur.refugio_id, ur.rol_id, ur.estado_usuario
                 FROM vw_UsuariosDatos u
                 JOIN UsuarioRol ur ON u.id = ur.usuario_id
                 LEFT JOIN vw_UsuariosMultimedia m ON u.id = m.usuario_id AND m.tipo_archivo = 'foto'
                 where ur.rol_id= 3`,
                { type: sequelize.QueryTypes.SELECT }
            );

            console.log("Usuarios recibidos?",usuariosRaw);
            const usuariosMap = {};
            const usuarios = [];

            usuariosRaw.forEach(row => {
                
                const pertenece = !user.refugio_id || row.refugio_id == user.refugio_id;
                

                if (!pertenece) return;

                if (!usuariosMap[row.id]) {
                    usuariosMap[row.id] = {
                        id: row.id,
                        nombre: row.nombre,
                        apellido1: row.apellido1,
                        apellido2: row.apellido2,
                        usuario: row.usuario,
                        roles_estado: row.roles_estado,

                        fotos: []
                    };
                    usuarios.push(usuariosMap[row.id]);
                }

                if (row.url) {
               
                    const existeFoto = usuariosMap[row.id].fotos.find(f => f.url === row.url);
                    if (!existeFoto) {
                        usuariosMap[row.id].fotos.push({ url: row.url });
                    }
                }
            });

            res.render('admin_refugio/trabajadores', { usuarios });
        } catch (error) {
            res.status(500).send("Error al obtener usuarios: " + error.message);
        }
    },

   
    async listarNombre(req, res) {
        try {
            const user = req.session.user;
            const nombre = req.query.nombre;

            const usuariosRaw = await sequelize.query(
                `SELECT u.*, m.url, ur.refugio_id
                 FROM vw_UsuariosDatos u
                 JOIN UsuarioRol ur ON u.id = ur.usuario_id
                 LEFT JOIN vw_UsuariosMultimedia m ON u.id = m.usuario_id AND m.tipo_archivo = 'foto'
                 WHERE (u.nombre LIKE :nombre OR u.apellido1 LIKE :nombre) and ur.rol_id=3`,
                {
                    type: sequelize.QueryTypes.SELECT,
                    replacements: { nombre: `%${nombre}%` }
                }
            );

            const usuariosMap = {};
            const usuarios = [];

            usuariosRaw.forEach(row => {
                const pertenece = !user.refugio_id || row.refugio_id == user.refugio_id;
                if (!pertenece) return;

                if (!usuariosMap[row.id]) {
                    usuariosMap[row.id] = {
                        id: row.id,
                        nombre: row.nombre,
                        apellido1: row.apellido1,
                        usuario: row.usuario,
                        roles_estado: row.roles_estado,
                        fotos: []
                    };
                    usuarios.push(usuariosMap[row.id]);
                }

                if (row.url) {
                    const existeFoto = usuariosMap[row.id].fotos.find(f => f.url === row.url);
                    if (!existeFoto) usuariosMap[row.id].fotos.push({ url: row.url });
                }
            });

            res.render('admin_refugio/trabajadores', { usuarios });
        } catch (error) {
            res.status(500).send("Error al buscar usuarios: " + error.message);
        }
    },

    
    async listarEdad(req, res) {
        try {
            const user = req.session.user;
            const edad = parseInt(req.query.edad);

            const usuariosRaw = await sequelize.query(
                `SELECT u.*, m.url, ur.refugio_id
                 FROM vw_UsuariosDatos u
                 JOIN UsuarioRol ur ON u.id = ur.usuario_id
                 LEFT JOIN vw_UsuariosMultimedia m ON u.id = m.usuario_id AND m.tipo_archivo = 'foto'
                 WHERE u.edad = :edad and ur.rol_id=3`,
                {
                    type: sequelize.QueryTypes.SELECT,
                    replacements: { edad }
                }
            );

          
            const usuariosMap = {};
            const usuarios = [];
            usuariosRaw.forEach(row => {
                const pertenece = !user.refugio_id || row.refugio_id == user.refugio_id;
                if (!pertenece) return;
                if (!usuariosMap[row.id]) {
                    usuariosMap[row.id] = {
                        id: row.id,
                        nombre: row.nombre,
                        apellido1: row.apellido1,
                        edad: row.edad,
                        usuario: row.usuario,
                        roles_estado: row.roles_estado,
                        fotos: []
                    };
                    usuarios.push(usuariosMap[row.id]);
                }
                if (row.url) {
                    const existeFoto = usuariosMap[row.id].fotos.find(f => f.url === row.url);
                    if (!existeFoto) usuariosMap[row.id].fotos.push({ url: row.url });
                }
            });

            res.render('admin_refugio/trabajadores', { usuarios });
        } catch (error) {
            res.status(500).send("Error al filtrar usuarios por edad: " + error.message);
        }
    },

    
    async listarId(req, res) {
        try {
            const user = req.session.user;
            const id = parseInt(req.query.id);

            
            const usuarioRaw = await sequelize.query(
                `SELECT u.*, ur.refugio_id, ur.estado_usuario, ur.rol_id,
                        m.url, m.tipo_archivo, ur.salario
                 FROM vw_UsuariosDatos u
                 JOIN UsuarioRol ur ON u.id = ur.usuario_id
                 LEFT JOIN vw_UsuariosMultimedia m ON u.id = m.usuario_id
                 

                 WHERE u.id = :id and ur.rol_id=3  `,
                {
                    type: sequelize.QueryTypes.SELECT,
                    replacements: { id }
                }
            );

            if (usuarioRaw.length === 0) return res.status(404).send("Usuario no encontrado");

            
            const pertenece = !user.refugio_id || usuarioRaw.some(row => row.refugio_id == user.refugio_id);
            
            if (!pertenece) return res.status(403).send("No tiene permiso para ver este usuario.");

            const direcciones = await Direccion.findAll({
                where: { dueno_id: id, tipoEntidad: 'Usuario' }
            });

            const telefonos = await NumeroCel_Tel.findAll({
                where: { dueno_id: id, tipoEntidad: 'Usuario' }
            });

            const fotos= await Foto.findAll({
                where: { dueno_id: id, tipoEntidad: 'Usuario' }
            });

            const documentos=await DocumentoOficial.findAll({
                where: { dueno_id: id, tipoEntidad: 'Usuario' }
            })

            const usuarioObj = {
                id: usuarioRaw[0].id,
                nombre: usuarioRaw[0].nombre,
                apellido1: usuarioRaw[0].apellido1,
                apellido2: usuarioRaw[0].apellido2,
                edad: usuarioRaw[0].edad,
                usuario: usuarioRaw[0].usuario,
                roles_estado: usuarioRaw[0].roles_estado,
                documentos_completos: usuarioRaw[0].documentos_completos,
                salario: usuarioRaw[0].salario,
                fotos: fotos,
                documentos: documentos,
               
                listaDirecciones: direcciones,
                listaTelefonos: telefonos
            };
        console.log("direcciones:",direcciones);
        console.log("telefonos:",telefonos);
           
           
            res.render("admin_refugio/trabajador_detalles", { usuario: usuarioObj });

        } catch (error) {
            res.status(500).send("Error al obtener detalles del usuario: " + error.message);
        }
    },

    
    
  formulario(req, res) {
    user = req.session.user;
    res.render("admin_refugio/input_trabajador", {user});
  },

  async guardar(req, res) {
    try {
        let { nombre, apellido1, apellido2, edad, usuario, contrasena, refugioId, salario } = req.body;
        edad = parseInt(edad);
        salario = parseFloat(salario);
        const user = req.session.user;
        // if(user.refugio_id){
        //   refugioId=user.refugio_id;
        // }
        let refugio_id=parseInt(refugioId);
         if(!apellido2){
            apellido2=null;
        }
        const Trabajador = await Usuario.create({ 
            nombre,
            apellido1,
            apellido2,
            edad,
            usuario,
            contrasena
        });
   
        await UsuarioRol.create({
            usuario_id: Trabajador.id,
            rol_id: 3, // Trabajador
            refugio_id: refugio_id,
            salario: salario,
            estado_usuario: 'proceso', 
            documentos_completos: 0
        });
        res.redirect("/admin_refugio/listar_trabajadores");
    } catch (error) {
        res.status(500).send("Error al guardar trabajador: " + error.message);
    }
},


async modificarFormulario(req, res) {
  try {
    const id  = parseInt(req.params.id);
    const usuario = await Usuario.findByPk(id);
    const usuarioRol = await UsuarioRol.findOne({ where: { usuario_id: id, rol_id: 3 } });
    if(!usuarioRol) return res.status(404).send("Relación Usuario-Rol no encontrada");
    if (!usuario) return res.status(404).send("Usuario no encontrado");
    res.render("admin_refugio/modificar_trabajador", { usuario,usuarioRol,user:req.session.user });
  } catch (error) {
    res.status(500).send("Error al mostrar formulario de modificación: " + error.message);
  }
},

async modificar(req, res) {
  try {
    const  id  = parseInt(req.params.id);
    let { nombre, apellido1, apellido2, edad, usuario, password,salario } = req.body;
    const usuarioObj = await Usuario.findByPk(id);
    if (!usuarioObj) return res.status(404).send("Usuario no encontrado");
    await usuarioObj.update({
      nombre,
      apellido1,
        apellido2,
        edad: parseInt(edad),
        usuario,
        contrasena: password,
        salario: parseFloat(salario)
    });

    const usuarioRol = await UsuarioRol.findOne({
      where: { usuario_id: id, rol_id: 3 } 
    });
    if (usuarioRol) {
      await usuarioRol.update({ salario: parseFloat(salario) });
    }
    res.json({ mensaje: "Trabajador modificado correctamente" });
  } catch (error) {
    res.status(500).send("Error al modificar trabajador: " + error.message);
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

        if(usuarioRol.rol_id !=3){
            return res.status(403).send("El usuario no es un trabajador");
        }

        if(user.refugio_id!== usuarioRol.refugio_id && user.refugio_id){
            return res.status(403).send("No tiene permiso para agregar dirección a este trabajador");
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

async borrarDireccion(req, res) {
    try{
        const {direccion_id,indice,usuario_id} = req.body;
        const dueno_id=parseInt(usuario_id);
        const tipoEntidad = "Usuario";
        const user = req.session.user;
        const indiceInt = parseInt(indice)-1;

        if(!dueno_id) return res.status(400).send("ID de usuario requerido");
        const usuarioRol = await UsuarioRol.findOne({
            where: { usuario_id: dueno_id }
                });
        if(usuarioRol.rol_id !=3){
            return res.status(403).send("El usuario no es un trabajador");
        }
        if(user.refugio_id!== usuarioRol.refugio_id && user.refugio_id){
            return res.status(403).send("No tiene permiso para borrar dirección a este trabajador");
        }
       
        const direcciones = await Direccion.findAll({
            where: { dueno_id: dueno_id, tipoEntidad: tipoEntidad },
            order: [['id', 'ASC']]
        });
        if(direcciones.length===0) return res.status(404).send("No hay direcciones para este usuario");
        if(indiceInt < 0 || indiceInt >= direcciones.length){
            return res.status(400).send("Índice de dirección inválido");
        }
       
        
        const direccionABorrar = direcciones[indiceInt];
        await direccionABorrar.destroy();
        res.json({mensaje: "Dirección eliminada", data: direccionABorrar});
    }
    catch(error){
        res.status(500).send("Error al borrar dirección: " + error.message);
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
        if(usuarioRol.rol_id !=3){
            return res.status(403).send("El usuario no es un trabajador");
        }
        if(user.refugio_id!== usuarioRol.refugio_id && user.refugio_id){
            return res.status(403).send("No tiene permiso para agregar teléfono a este trabajador");
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

async borrarTelefono(req, res) {
    try{    
        const {indice,usuario_id} = req.body;
        const dueno_id=parseInt(usuario_id);
        const tipoEntidad="Usuario";
        const user = req.session.user;
        const indiceInt = parseInt(indice)-1;
   
        if(!dueno_id) return res.status(400).send("ID de usuario requerido");
        const usuarioRol = await UsuarioRol.findOne({
            where: { usuario_id: dueno_id }
                });
        if(usuarioRol.rol_id !=3){
            return res.status(403).send("El usuario no es un trabajador");
        }
        if(user.refugio_id!== usuarioRol.refugio_id && user.refugio_id){
            return res.status(403).send("No tiene permiso para borrar número a este trabajador");
        }
       
        const telefonos = await NumeroCel_Tel.findAll({
            where: { dueno_id: dueno_id, tipoEntidad: tipoEntidad },
            order: [['id', 'ASC']]
        });
        if(telefonos.length===0) return res.status(404).send("No hay telefonos para este usuario");
        if(indiceInt < 0 || indiceInt >= telefonos.length){
            return res.status(400).send("Índice de telefono inválido");
        }
       const telefonoABorrar=telefonos[indiceInt];
       await telefonoABorrar.destroy();
       res.json({mensaje:"Dirección eliminada", data: telefonoABorrar})
    }
   catch(error){
        res.status(500).send("Error al borrar telefono: " + error.message);
    }
},

    async aprobarUsuario(req, res) {
        try {
            const usuario_id = parseInt(req.body.usuario_id);
            const user = req.session.user;
             const whereClause = { usuario_id: usuario_id };
            const usuarioRol = await UsuarioRol.findOne({ where: whereClause });
            
            if (!usuario_id) return res.status(400).send("ID de usuario requerido");

           
            if(user.refugio_id!== usuarioRol.refugio_id && user.refugio_id){
                return res.status(403).send("No tiene permiso para aprobar a este trabajador");
            }


            if (user.refugio_id) {
                whereClause.refugio_id = user.refugio_id;
            }
          
            if (!usuarioRol) {
                return res.status(404).send("No se encontró la relación Usuario-Refugio para aprobar.");
            }
            if(usuarioRol.rol_id !=3){
                return res.status(403).send("El usuario no es un trabajador");
            }
            
        
            const [updatedRows] = await UsuarioRol.update(
                { documentos_completos:1 },
                { where: whereClause }
            );

            if (updatedRows === 0) {
                return res.status(404).send("No se encontró la al usuario o ya está aprobado.");
            }

           
            res.json({ mensaje: "Usuario aprobado" });

        } catch (error) {
            res.status(500).send("Error al aprobar usuario: " + error.message);
        }
    },
    
    async rechazarUsuario(req, res) {
        try {
            const usuario_id = parseInt(req.body.usuario_id);
            const user = req.session.user;
            const whereClause = { usuario_id: usuario_id };
            const usuarioRol = await UsuarioRol.findOne({ where: whereClause });
           
            if (!usuario_id) return res.status(400).send("ID de usuario requerido");

            
            if(user.refugio_id!== usuarioRol.refugio_id && user.refugio_id){
                return res.status(403).send("No tiene permiso para rechazar a este trabajador");
            }

            if (user.refugio_id) {
                whereClause.refugio_id = user.refugio_id;
            }
     
            if (!usuarioRol) {
                return res.status(404).send("No se encontró la relación Usuario-Refugio para rechazar.");
            }
            if(usuarioRol.rol_id !=3){
                return res.status(403).send("El usuario no es un trabajador");
            }
      
            const [updatedRows] = await UsuarioRol.update(
                { estado_usuario: 'rechazado' },
                { where: whereClause }
            );

            if (updatedRows === 0) {
                return res.status(404).send("No se encontró la relación Usuario-Refugio o ya está aprobado.");
            }
            return res.json({ mensaje: "Usuario rechazado" });

        } catch (error) {
            return res.status(500).send("Error al aprobar usuario: " + error.message);
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

            if (user.refugio_id) {
                whereClause.refugio_id = user.refugio_id;
            }
            const usuarioRol = await UsuarioRol.findOne({ where: whereClause });
            if (!usuarioRol) {
                return res.status(404).send("No se encontró la relación Usuario-Refugio para aprobar.");
            }
            if(usuarioRol.rol_id !=3){
                return res.status(403).send("El usuario no es un trabajador");
            }

            const url = "uploads/" + req.file.filename;
            const tipoEntidad = "Usuario";
  
            const nuevaFoto = await Foto.create({
                dueno_id: parseInt(dueno_id),
                tipoEntidad,
                urlImagen: url
            });

            return res.json({ mensaje: "Foto subida correctamente", data: nuevaFoto });
        } catch (error) {
            return res.status(500).send("Error al subir foto: "+error.message);
        }
    },


    async borrarFoto(req, res) {
        try {
            const dueno_id = parseInt(req.body.dueno_id);
            const indice = parseInt(req.body.indice);
            const tipoEntidad = "Usuario";
            const user=req.session.user;

                  
            if (!dueno_id) return res.status(400).send("ID de usuario requerido");

            const whereClause = { usuario_id: dueno_id };

            if (user.refugio_id) {
                whereClause.refugio_id = user.refugio_id;
            }
         
            const usuarioRol = await UsuarioRol.findOne({ where: whereClause });
            if (!usuarioRol) {
                return res.status(404).send("No se encontró la relación Usuario-Refugio para aprobar.");
            }
            if(usuarioRol.rol_id !=3){
                return res.status(403).send("El usuario no es un trabajador");
            }

            const fotos = await Foto.findAll({
                where: { dueno_id, tipoEntidad },
                order: [["id", "ASC"]]
            });

            if (fotos.length === 0) return res.status(404).send("El usuario no tiene fotos");

            const pos = Number(indice) - 1;
            if (pos < 0 || pos >= fotos.length) return res.status(400).send("Índice inválido");

            const foto = fotos[pos];

            const ruta = path.join(__dirname, "..", foto.urlImagen);
            fs.unlink(ruta, err => {
                if (err) console.warn("No se pudo borrar archivo físico:", err);
            });

            await foto.destroy();

            const uploadPath = path.join(__dirname, "..", "uploads", path.basename(foto.urlImagen));
            fs.unlink(uploadPath, err => {
              if (err) console.warn("No se pudo borrar el archivo de uploads:", err);
            }
            );

            return res.json({ mensaje: "Foto eliminada", fotoEliminada: foto.id });
        } catch (error) {
            return res.status(500).send("Error al borrar foto");
        }
    },

    async subirDocumento(req, res) {
        try {
            const { dueno_id, nombre_dueno, descripcion, fecha_emision } = req.body;

            if (!req.file) return res.status(400).send("No se envió archivo");
                        // Validaciones
            if (!dueno_id) return res.status(400).send("ID de usuario requerido");
            const user=req.session.user;

            const whereClause = { usuario_id: dueno_id };

            if (user.refugio_id) {
                whereClause.refugio_id = user.refugio_id;
            }
      
            const usuarioRol = await UsuarioRol.findOne({ where: whereClause });
            if (!usuarioRol) {
                return res.status(404).send("No se encontró la relación Usuario-Refugio para aprobar.");
            }
            if(usuarioRol.rol_id !=3){
                return res.status(403).send("El usuario no es un trabajador");
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

    async borrarDocumento(req, res) {
        try {
            const dueno_id = parseInt(req.body.dueno_id);
            const indice = parseInt(req.body.indice);
            const tipoEntidad = "Usuario";
            const user=req.session.user;
            // Validaciones
            if (!dueno_id) return res.status(400).send("ID de usuario requerido");

            const whereClause = { usuario_id: dueno_id };

            if (user.refugio_id) {
                whereClause.refugio_id = user.refugio_id;
            }
          
            const usuarioRol = await UsuarioRol.findOne({ where: whereClause });
            if (!usuarioRol) {
                return res.status(404).send("No se encontró la relación Usuario-Refugio para aprobar.");
            }
            if(usuarioRol.rol_id !=3){
                return res.status(403).send("El usuario no es un trabajador");
            }
            const docs = await DocumentoOficial.findAll({
                where: { dueno_id, tipoEntidad },
                order: [["id", "ASC"]]
            });

            if (docs.length === 0) return res.status(404).send("No hay documentos");

            const pos = Number(indice) - 1; //Number hace una conversión de string a número
            if (pos < 0 || pos >= docs.length) return res.status(400).send("Índice inválido");

            const doc = docs[pos];

            const ruta = path.join(__dirname, "..", doc.url);
            fs.unlink(ruta, err => {
                if (err) console.warn("No se pudo borrar archivo físico:", err);
            });

            await doc.destroy();

            //Borrar de uploads 
            const uploadPath = path.join(__dirname, "..", "uploads", path.basename(doc.url));
            fs.unlink(uploadPath, err => {
              if (err) console.warn("No se pudo borrar el archivo de uploads:", err);
            }
            );

            res.json({ mensaje: "Documento eliminado", documentoEliminado: doc.id });
        } catch (error) {
            res.status(500).send("Error al borrar documento: "+error.message);
        }
    }


};