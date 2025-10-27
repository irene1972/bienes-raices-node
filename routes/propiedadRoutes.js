import express from 'express';
import { body } from 'express-validator';
import { 
    admin,
    crear,
    guardar,
    agregarImagen
} from '../controllers/propiedadController.js';
import protegerRuta from '../middleware/protegerRuta.js';

const router=express.Router();

router.get('/mis-propiedades',protegerRuta,admin);
router.get('/propiedades/crear',protegerRuta,crear);
router.post('/propiedades/crear',protegerRuta,
    //body('titulo').notEmpty().withMessage('El título del anuncio es obligatorio'),
    guardar);

router.get('/propiedades/agregar-imagen/:id',protegerRuta,agregarImagen);

export default router;