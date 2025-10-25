import express from 'express';
import usuarioRoutes from './routes/usuarioRoutes.js';
import db from './config/db.js';

const app=express();

//habilitar lectura de datos de formularios
app.use(express.urlencoded({extended:true}));

//conexión a la bd
try {
    await db.authenticate();
    //crea la tabla en el caso de que no esté creada
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
const port=process.env.SERVER_PORT;
app.listen(port,()=>{
    console.log(`El servidor está funcionando en el puerto ${port}`);
});