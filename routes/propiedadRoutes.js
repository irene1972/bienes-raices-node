import express from 'express';
//import { body } from 'express-validator';
import { 
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
} from '../controllers/propiedadController.js';
import protegerRuta from '../middleware/protegerRuta.js';
import upload from '../middleware/subirImagen.js';
import identificarUsuario from '../middleware/identificarUsuario.js';

const router=express.Router();

router.get('/mis-propiedades',protegerRuta,admin);
router.get('/propiedades/crear',protegerRuta,crear);
router.post('/propiedades/crear',protegerRuta,
    //body('titulo').notEmpty().withMessage('El título del anuncio es obligatorio'),
    guardar);

router.get('/propiedades/agregar-imagen/:id',protegerRuta,agregarImagen);
router.post('/propiedades/agregar-imagen/:id',
    protegerRuta,
    upload.single('imagen'),
    almacenarImagen
);
router.get('/propiedades/editar/:id',
    protegerRuta,
    editar
);
router.post('/propiedades/editar/:id',
    protegerRuta,
    guardarCambios
);
router.post('/propiedades/eliminar/:id',
    protegerRuta,
    eliminar
);

//Area pública
router.get('/propiedad/:id',
    identificarUsuario,
    mostrarPropiedad
);

router.post('/propiedad/:id',
    identificarUsuario,
    enviarMensaje
);

router.get('/mensajes/:idPropiedad',
    protegerRuta,
    verMensajes
);

export default router;