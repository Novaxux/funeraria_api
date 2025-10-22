import express from 'express';
const router = express.Router();
import usuariosController from '../controllers/usuarios.controller.js';

router.get('/', usuariosController.getAll);
router.get('/:id', usuariosController.getById);
router.post('/', usuariosController.create);
router.put('/:id', usuariosController.update);
router.delete('/:id', usuariosController.remove);

export default router;