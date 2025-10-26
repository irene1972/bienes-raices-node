import categorias from "./categorias.js";
import Categoria from "../models/Categoria.js";
import precios from "./precios.js";
import Precio from "../models/Precio.js";
import db from "../config/db.js";

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

if(process.argv[2]==='-i'){
    importarDatos();
}