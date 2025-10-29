import {unlink} from 'node:fs/promises';
//import {validationResult} from 'express-validator';
import {Precio, Categoria, Propiedad, Mensaje, Usuario} from '../models/index.js';
import { esVendedor, formatearFecha } from '../helpers/index.js';

const admin=async(req,res)=>{
    const {id}=req.usuario;

    //paginación *****************
    const {pagina:paginaActual}=req.query;
    const regexp=/^[1-9]$/;
    if(!regexp.test(paginaActual)) return res.redirect('/mis-propiedades?pagina=1');
    try {
        const limit=10;
        const offset=((paginaActual*limit)-limit);
        //****************************

        const [propiedades,total]=await Promise.all([
        Propiedad.findAll({
            limit,
            offset,
            where:{
                usuarioId:id
            },
            include:[
                {model:Categoria, as:'categoria'},
                {model:Precio, as:'precio'},
                {model:Mensaje, as:'mensajes'}
            ]
        }),
        Propiedad.count({
            where:{
                usuarioId:id
            }
        })
        ]);
        //console.log(total);

    res.render('propiedades/admin',{
        pagina:'Mis Propiedades',
        propiedades,
        paginas:Math.ceil(total/limit),
        paginaActual:Number(paginaActual),
        total,
        offset,
        limit

    });
    } catch (error) {
        console.log(error);
    }
    
    
    

}

const crear=async(req,res)=>{
    //consultar modelo de Precio y Categoria 
    const [precios,categorias]=await Promise.all([
        Precio.findAll(),
        Categoria.findAll()
    ]);

    res.render('propiedades/crear',{
        pagina:'Crear Propiedad',
        categorias,
        precios,
        datos:{}
    });
}

const guardar=async(req,res)=>{
    //validación
    const {titulo,descripcion,categoria:categoriaId,precio:precioId,habitaciones,estacionamiento,calle,wc,lat,lng}=req.body;
   
    if(!titulo || !descripcion || !categoriaId || !precioId || !habitaciones || !estacionamiento || !wc || !lat || !calle){
        const [precios,categorias]=await Promise.all([
            Precio.findAll(),
            Categoria.findAll()
        ]);

        return res.render('propiedades/crear',{
        pagina:'Crear Propiedad',
        //csrfToken:req.csrfToken(),
        categorias,
        precios,
        errores:'Todos los campos son obligatorios',
        datos:req.body
    });
    }
    
    //crear un registro
    try {
        const propiedadGuardada=await Propiedad.create({
            titulo,
            descripcion,
            habitaciones,
            estacionamiento,
            wc,
            calle,
            lat,
            lng,
            precioId,
            categoriaId,
            usuarioId:req.usuario.id,
            imagen:''
        });
        const {id}=propiedadGuardada;
        res.redirect(`/propiedades/agregar-imagen/${id}`);
    } catch (error) {
        console.log(error);        
    }

}

const agregarImagen=async(req,res)=>{
    const {id}=req.params;

    //validar que la propiedad existe
    const propiedad=await Propiedad.findByPk(id);
    if(!propiedad) return res.redirect('/mis-propiedades');

    //validar que la propiedad no esté publicada
    const {publicado,usuarioId}=propiedad;
    if(publicado) return res.redirect('/mis-propiedades');

    //validar que la propiedad pertenece a quien visita esta página
    if(usuarioId !== req.usuario.id) return res.redirect('/mis-propiedades');

    res.render('propiedades/agregar-imagen',{
        pagina:`Agregar Imagen: ${propiedad.titulo}`,
        propiedad
    });
}

const almacenarImagen=async(req,res,next)=>{
    const {id}=req.params;

    //validar que la propiedad existe
    const propiedad=await Propiedad.findByPk(id);
    if(!propiedad) return res.redirect('/mis-propiedades');

    //validar que la propiedad no esté publicada
    const {publicado,usuarioId}=propiedad;
    if(publicado) return res.redirect('/mis-propiedades');

    //validar que la propiedad pertenece a quien visita esta página
    if(usuarioId !== req.usuario.id) return res.redirect('/mis-propiedades');

    try {
        //almacenar la imagen y publicar propiedad
        propiedad.imagen=req.file.filename;
        propiedad.publicado=1;

        await propiedad.save();

        next();
        
    } catch (error) {
        console.log(error);
    }
}

const editar=async(req,res)=>{
    //consultar modelo de Precio y Categoria 
    const [precios,categorias,propiedad]=await Promise.all([
        Precio.findAll(),
        Categoria.findAll(),
        Propiedad.findByPk(req.params.id)
    ]);

    if(!propiedad) return res.redirect('/mis-propiedades');

    //asegurar que solo puede editar una propiedad el usuario que la ha creado
    if(req.usuario.id !== propiedad.usuarioId) return res.redirect('/mis-propiedades');

    res.render('propiedades/editar',{
        pagina:`Editar Propiedad: ${propiedad.titulo}`,
        categorias,
        precios,
        datos:propiedad
    });
}

const guardarCambios=async(req,res)=>{
    //consultar modelo de Precio y Categoria 
    const [precios,categorias,propiedad]=await Promise.all([
        Precio.findAll(),
        Categoria.findAll(),
        Propiedad.findByPk(req.params.id)
    ]);

    const {titulo,descripcion,categoria:categoriaId,precio:precioId,habitaciones,estacionamiento,calle,wc,lat,lng}=req.body;

    if(!titulo || !descripcion || !categoriaId || !precioId || !habitaciones || !estacionamiento || !wc || !lat) return res.render('propiedades/editar',{
        pagina:'Editar Propiedad',
        errores:'Todos los campos son obligatorios',
        categorias,
        precios,
        datos:req.body
    });
    
    if(!propiedad) return res.redirect('/mis-propiedades');

    //asegurar que solo puede editar una propiedad el usuario que la ha creado
    if(req.usuario.id !== propiedad.usuarioId) return res.redirect('/mis-propiedades');

    //reescribir el objeto y actualizarlo
    try {
        propiedad.set({
            titulo,
            descripcion,
            habitaciones,
            estacionamiento,
            wc,
            calle,
            lat,
            lng,
            precioId,
            categoriaId
        });
        await propiedad.save();
        res.redirect('/mis-propiedades');
    } catch (error) {
        console.log(error);
    }

}

const eliminar=async(req,res)=>{
    
    const {id}=req.params;

    //validar que la propiedad existe
    const propiedad=await Propiedad.findByPk(id);
    if(!propiedad) return res.redirect('/mis-propiedades');

    //validar que la propiedad no esté publicada
    const {usuarioId}=propiedad;

    //validar que la propiedad pertenece a quien visita esta página
    if(usuarioId !== req.usuario.id) return res.redirect('/mis-propiedades');
    
    //Eliminar la imagen asociada a la propiedad
    await unlink(`public/uploads/${propiedad.imagen}`);

    console.log(`Se eliminó la imagen ${propiedad.imagen}`);

    //Eliminar la propiedad
    await propiedad.destroy();
    res.redirect('/mis-propiedades');
}

const mostrarPropiedad=async(req,res)=>{
    //validar que la propiedad existe
    const {id}=req.params;
    //console.log(req.usuario);
    const propiedad=await Propiedad.findByPk(id,{
        include:[
            {model:Categoria, as:'categoria'},
            {model:Precio, as:'precio'}
        ]
    });

    if(!propiedad) return res.redirect('/404');

    res.render('propiedades/mostrar',{
        pagina:propiedad.titulo,
        propiedad,
        usuario:req.usuario,
        esVendedor: esVendedor(req.usuario?.id,propiedad.usuarioId)
    });
}

const enviarMensaje=async(req,res)=>{
    const {mensaje}=req.body;
    const {id:usuarioId}=req.usuario;

    //validar que la propiedad existe
    const {id:propiedadId}=req.params;
    //console.log(req.usuario);
    const propiedad=await Propiedad.findByPk(propiedadId,{
        include:[
            {model:Categoria, as:'categoria'},
            {model:Precio, as:'precio'},
            //{model:Mensaje, as:'mensajes'}
        ]
    });

    if(!propiedad) return res.redirect('/404');

    if(mensaje.trim().length < 10){
        return res.render('propiedades/mostrar',{
        pagina:propiedad.titulo,
        errores:'El mensaje debe tener al menos 10 caracteres',
        propiedad,
        usuario:req.usuario,
        esVendedor: esVendedor(req.usuario?.id,propiedad.usuarioId)
    });
    }

    //almacenar el mensaje
    await Mensaje.create({
        mensaje,
        propiedadId,
        usuarioId
    });
/*
    res.render('propiedades/mostrar',{
        pagina:propiedad.titulo,
        propiedad,
        usuario:req.usuario,
        esVendedor: esVendedor(req.usuario?.id,propiedad.usuarioId),
        enviado:true
    });
    */
    res.redirect('/');
}

const verMensajes=async(req,res)=>{
    const {idPropiedad}=req.params;
    const {id:usuarioId}=req.usuario;

    const propiedad=await Propiedad.findByPk(idPropiedad,{
        include:[
            {model:Mensaje, as:'mensajes',
                include:[
                    {model:Usuario, as:'usuario'}
                ]
            }
        ]
    });

    if(!propiedad) return res.redirect('/mis-propiedades');

    if(usuarioId !== propiedad.usuarioId) return res.redirect('/mis-propiedades');

    //const mensajes=await Mensaje.findAll({where:{propiedadId:idPropiedad}});

    console.log(propiedad.mensajes);

    res.render('propiedades/mensajes',{
        pagina:'Mensajes',
        mensajes:propiedad.mensajes,
        formatearFecha
    });    
    
}

export {
    admin,
    crear,
    guardar,
    agregarImagen,
    almacenarImagen,
    editar,
    guardarCambios,
    eliminar,
    mostrarPropiedad,
    enviarMensaje,
    verMensajes
}
