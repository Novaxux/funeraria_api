import express from 'express';
const router = express.Router();
import clientesController from '../controllers/clientes.controller.js';
import { login } from '../controllers/auth.controller.js';

// Rutas CRUD
router.get('/', clientesController.getAll);
router.get('/:id', clientesController.getById);
router.post('/', clientesController.create);
router.put('/:id', clientesController.update);
router.delete('/:id', clientesController.remove);

// Ruta de Login
router.post('/login', login('clientes', 'id_cliente'));

export default router;