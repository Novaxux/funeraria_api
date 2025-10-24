import express from 'express';
const router = express.Router();
import recuerdosFamiliaresController from '../controllers/recuerdos_familiares.controller.js';

router.get('/', recuerdosFamiliaresController.getAll);
router.get('/:id', recuerdosFamiliaresController.getById);
router.post('/', recuerdosFamiliaresController.create);
router.put('/:id', recuerdosFamiliaresController.update);
router.delete('/:id', recuerdosFamiliaresController.remove);

export default router;