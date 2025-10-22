import express from 'express';
const router = express.Router();
import trabajadoresController from '../controllers/trabajadores.controller.js';
import { login } from '../controllers/auth.controller.js';

// Rutas CRUD
router.get('/', trabajadoresController.getAll);
router.get('/:id', trabajadoresController.getById);
router.post('/', trabajadoresController.create);
router.put('/:id', trabajadoresController.update);
router.delete('/:id', trabajadoresController.remove);

// Ruta de Login
router.post('/login', login('trabajadores', 'id_trabajador'));

export default router;