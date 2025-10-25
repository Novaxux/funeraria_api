import { Router } from "express";
import { FunerariasController } from "../controllers/funerarias.controller.js";
// import {
//   attachUser,
//   requireAdmin,
//   requireFuneraria,
// } from "../middlewares/auth.middleware.js";

const router = Router();

// Adjunta el usuario autenticado a la petición

// 👇 Rutas
router.get("/", FunerariasController.getAll);
router.get("/:id", FunerariasController.getById);

// Solo un administrador puede crear funerarias
router.post("/", FunerariasController.create);

// Admin o funeraria puede actualizar su información
router.patch("/:id", FunerariasController.patch);

// Solo administrador puede eliminar
router.delete("/:id", FunerariasController.remove);

export default router;
