import express from 'express';
import {inicio, categoria, noEncontrado, buscador} from '../controllers/appController.js';

const router=express.Router();

//página de inicio
router.get('/',inicio);

//categorías
router.get('/categorias/:id',categoria);

//página 404
router.get('/404',noEncontrado);

//buscador
router.post('/buscador',buscador);

export default router;