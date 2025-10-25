import { Router } from "express";
import { ClientesController } from "../controllers/clientes.controller.js";
// import {
//   attachUser,
//   requireAdmin,
// } from "../middlewares/auth.middleware.js";

const router = Router();

// Si manejas autenticación, puedes descomentar esto:
// router.use(attachUser);

// 👇 Rutas de clientes

// Obtener todos los clientes
router.get("/", ClientesController.getAll);

// Obtener cliente por ID
router.get("/:id", ClientesController.getById);

// Crear cliente (crea usuario automáticamente)
router.post("/", ClientesController.create);

// Actualizar cliente y/o su usuario vinculado
router.patch("/:id", ClientesController.patch);

// Desactivar cliente (baja lógica)
router.delete("/:id", ClientesController.remove);

// Reactivar cliente
router.patch("/:id/restore", ClientesController.restore);

export default router;
