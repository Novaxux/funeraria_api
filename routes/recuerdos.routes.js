import express from 'express';
const router = express.Router();
import recuerdosController from '../controllers/recuerdos.controller.js';

router.get('/', recuerdosController.getAll);
router.get('/:id', recuerdosController.getById);
router.post('/', recuerdosController.create);
router.put('/:id', recuerdosController.update);
router.delete('/:id', recuerdosController.remove);

export default router;