import categorias from "./categorias.js";
import precios from "./precios.js";
import db from "../config/db.js";
import {Categoria, Precio} from "../models/index.js";

const importarDatos=async()=>{
    try {
        //autenticar en la bd
        await db.authenticate();

        //generar las columnas
        await db.sync();

        //insertamos los datos
        await Categoria.bulkCreate(categorias);
        await Precio.bulkCreate(precios);
        console.log('Datos importados correctamente');
        process.exit(0);

    } catch (error) {
        console.log(error);
        process.exit(1);
    }
}

const eliminarDatos=async()=>{
    try {
        await Promise.all([
            Categoria.destroy({where:{},truncate:true}),
            Precio.destroy({where:{},truncate:true})
        ]);
        console.log('Datos Eliminados Correctamente');
        process.exit();
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
}

if(process.argv[2]==='-i'){
    importarDatos();
}

if(process.argv[2]==='-e'){
    eliminarDatos();
}