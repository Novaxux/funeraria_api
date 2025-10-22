import express from 'express';
const router = express.Router();
import adminsController from '../controllers/admins.controller.js';
import { login } from '../controllers/auth.controller.js';

// Rutas CRUD
router.get('/', adminsController.getAll);
router.get('/:id', adminsController.getById);
router.post('/', adminsController.create);
router.put('/:id', adminsController.update);
router.delete('/:id', adminsController.remove);

// Ruta de Login
router.post('/login', login('admins', 'id_admin'));

export default router;