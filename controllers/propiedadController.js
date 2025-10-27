import {validationResult} from 'express-validator';
import {Precio, Categoria, Propiedad} from '../models/index.js';

const admin=(req,res)=>{
    res.render('propiedades/admin',{
        pagina:'Mis Propiedades',
        barra:true
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
        barra:true,
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
        barra:true,
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

export {
    admin,
    crear,
    guardar
}