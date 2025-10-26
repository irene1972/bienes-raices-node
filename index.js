import express from 'express';
import csrf from 'csurf';
import cookieParser from 'cookie-parser';
import usuarioRoutes from './routes/usuarioRoutes.js';
import db from './config/db.js';

const app=express();

//habilitar lectura de datos de formularios
app.use(express.urlencoded({extended:true}));

//************************************* */
//HABILITAR PARA SEGURIDAD EN FORMULARIOS
//habilitar cookie-parser
app.use(cookieParser());
//habilitar csrf
app.use(csrf({cookie:true}));
//************************************* */

//conexión a la bd
try {
    await db.authenticate();
    //sb.sync crea la tabla en el caso de que no esté creada (necesaria para producción)
    db.sync();
    console.log('Conexión correcta a la bd');
} catch (error) {
    console.log(error);
}

//habilitar pug
app.set('view engine','pug');
app.set('views','./views');

//carpet pública
app.use(express.static('public'));

//routing
app.use('/auth', usuarioRoutes);

//Definir puerto y arrancar el servido
const port=process.env.SERVER_PORT || 3000;
app.listen(port,()=>{
    console.log(`El servidor está funcionando en el puerto ${port}`);
});