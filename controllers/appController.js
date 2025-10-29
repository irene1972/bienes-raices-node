import {Precio, Categoria, Propiedad} from '../models/index.js';

const inicio=async(req,res)=>{
    
    const [categorias, precios,casas,departamentos]=await Promise.all([
        Categoria.findAll({raw:true}),
        Precio.findAll({raw:true}),
        Propiedad.findAll({
            limit:3,
            where:{
                categoriaId:1
            },
            include:[
                {
                    model:Precio,
                    as:'precio'
                }
            ],
            order:[['createdAt','DESC']]
        }),
        Propiedad.findAll({
            limit:3,
            where:{
                categoriaId:2
            },
            include:[
                {
                    model:Precio,
                    as:'precio'
                }
            ],
            order:[['createdAt','DESC']]
        })
    ]);

    res.render('inicio',{
        pagina:'Inicio',
        categorias,
        precios,
        casas,
        departamentos
    });
    
}

const categoria=async(req,res)=>{
    const {id}=req.params;

    //comprobar que la categoría existe
    const categoria=await Categoria.findByPk(id);
    console.log(categoria);
    if(!categoria) return res.redirect('/404');

    //obtener las propiedades de la categoría
    const propiedades=await Propiedad.findAll({
        where:{
            categoriaId:id
        },
        include:[
            {model:Precio, as:'precio'}
        ]
    });

    res.render('categoria',{
        pagina:`${categoria.nombre}s en Venta`,
        propiedades
    });
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