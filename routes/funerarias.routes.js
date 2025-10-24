import { Router } from "express";
import { FunerariasController } from "../controllers/funerarias.controller.js";
import {
  attachUser,
  requireAdmin,
  requireFuneraria,
} from "../middlewares/auth.middleware.js";

const router = Router();

// Adjunta el usuario autenticado a la petición
router.use(attachUser);

// 👇 Rutas
router.get("/", FunerariasController.getAll);
router.get("/:id", FunerariasController.getById);

// Solo un administrador puede crear funerarias
router.post("/", requireAdmin, FunerariasController.create);

// Admin o funeraria puede actualizar su información
router.put("/:id", requireFuneraria, FunerariasController.update);

// Solo administrador puede eliminar
router.delete("/:id", requireAdmin, FunerariasController.remove);

export default router;
