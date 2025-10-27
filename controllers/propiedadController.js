import {validationResult} from 'express-validator';
import {Precio, Categoria, Propiedad} from '../models/index.js';

const admin=(req,res)=>{
    res.render('propiedades/admin',{
        pagina:'Mis Propiedades'
    });
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
    if(!titulo || !descripcion || !categoriaId || !precioId || !habitaciones || !estacionamiento || !wc || !lat){
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
        pagina:'Agregar Imagen'
    });
}

export {
    admin,
    crear,
    guardar,
    agregarImagen
}