import express from 'express';
const router = express.Router();

// Importar todas las rutas
import adminsRoutes from './admins.routes.js';
import clientesRoutes from './clientes.routes.js';
import trabajadoresRoutes from './trabajadores.routes.js';
import familiaresRoutes from './familiares.routes.js';
import funerariasRoutes from './funerarias.routes.js';
import recuerdosRoutes from './recuerdos.routes.js';
import recuerdosFamiliaresRoutes from './recuerdos_familiares.routes.js';
import usuariosRoutes from './usuarios.routes.js';

// Usar las rutas
router.use('/admins', adminsRoutes);
router.use('/clientes', clientesRoutes);
router.use('/trabajadores', trabajadoresRoutes);
router.use('/familiares', familiaresRoutes);
router.use('/funerarias', funerariasRoutes);
router.use('/recuerdos', recuerdosRoutes);
router.use('/recuerdos-familiares', recuerdosFamiliaresRoutes);
router.use('/usuarios', usuariosRoutes);

export default router;