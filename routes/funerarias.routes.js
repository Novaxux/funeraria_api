import express from 'express';
const router = express.Router();
import funerariasController from '../controllers/funerarias.controller.js';

router.get('/', funerariasController.getAll);
router.get('/:id', funerariasController.getById);
router.post('/', funerariasController.create);
router.put('/:id', funerariasController.update);
router.delete('/:id', funerariasController.remove);

export default router;