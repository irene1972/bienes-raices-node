import {Precio, Categoria, Propiedad} from '../models/index.js';

const inicio=async(req,res)=>{
    
    const [categorias, precios]=await Promise.all([
        Categoria.findAll({raw:true}),
        Precio.findAll({raw:true})
    ]);

    res.render('inicio',{
        pagina:'Inicio',
        categorias,
        precios
    });
    
}

const categoria=(req,res)=>{
    res.send('categoria...');
}

const noEncontrado=(req,res)=>{
    res.send('no encontrado...');
}

const buscador=(req,res)=>{
    res.send('buscador...');
}

export {
    inicio,
    categoria,
    noEncontrado,
    buscador
}