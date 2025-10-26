import Precio from '../models/Precio.js';
import Categoria from '../models/Categoria.js';

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
        precios
    });
}

export {
    admin,
    crear
}