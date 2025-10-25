import { Router } from "express";
import { AdminsController } from "../controllers/admins.controller.js";
// import { attachUser, requireAdmin } from "../middlewares/auth.middleware.js";

const router = Router();

// ✅ Aplica middleware de sesión y rol

// Rutas de administradores (solo accesibles por admin)
router.get("/", AdminsController.getAll);
router.get("/:id", AdminsController.getById);
router.post("/", AdminsController.create);
router.delete("/:id", AdminsController.remove);

export default router;
