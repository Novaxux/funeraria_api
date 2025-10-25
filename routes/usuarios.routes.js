import { Router } from "express";
import { UsersController } from "../controllers/users.controller.js";
// import {
//   attachUser,
//   requireAdmin,
// } from "../middlewares/auth.middleware.js";

const router = Router();

// Adjunta el usuario autenticado a la petición (si usas autenticación)
// router.use(attachUser);

// 👇 Rutas de usuarios
router.get("/", UsersController.getAll); // Obtener todos los usuarios
router.get("/:id", UsersController.getById); // Obtener usuario por ID
router.get("/correo/:correo", UsersController.getByEmail); // Buscar por correo

// Crear nuevo usuario (registro general o solo admin)
router.post("/", UsersController.create);

// Actualizar datos del usuario (admin o el mismo usuario)
router.patch("/:id", UsersController.patch);

// Desactivar usuario (solo admin)
router.delete("/:id", UsersController.remove);

// Reactivar usuario (solo admin)
router.patch("/:id/restore", UsersController.restore);

export default router;
