import express from 'express';
const router = express.Router();
import familiaresController from '../controllers/familiares.controller.js';

router.get('/', familiaresController.getAll);
router.get('/:id', familiaresController.getById);
router.post('/', familiaresController.create);
router.put('/:id', familiaresController.update);
router.delete('/:id', familiaresController.remove);

export default router;