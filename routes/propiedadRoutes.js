import express from 'express';
import { body } from 'express-validator';
import { 
    admin,
    crear,
    guardar
} from '../controllers/propiedadController.js';
import protegerRuta from '../middleware/protegerRuta.js';

const router=express.Router();

router.get('/mis-propiedades',protegerRuta,admin);
router.get('/propiedades/crear',crear);
router.post('/propiedades/crear',
    //body('titulo').notEmpty().withMessage('El título del anuncio es obligatorio'),
    guardar);

export default router;