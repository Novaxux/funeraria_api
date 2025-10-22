import { Router } from "express";
import { CrudRepository } from "../models/crud.repository.js";
import { makeCrudController } from "../controllers/crud.controller.js";
import { requireAdmin, requireFuneraria, requireEmpleado, requireCliente } from "../middlewares/auth.middleware.js";

const router = Router();

// Tables to expose with desired access control.
// For brevity we only wire simple role checks per instructions.

function resource(name, middlewares = []) {
  const repo = new CrudRepository(name);
  const controller = makeCrudController(repo);
  const r = Router();
  r.get("/", middlewares, controller.list);
  r.get("/:id", middlewares, controller.get);
  r.post("/", middlewares, controller.create);
  r.put("/:id", middlewares, controller.update);
  r.delete("/:id", middlewares, controller.remove);
  return r;
}

// funerarias: admin only
router.use("/funerarias", resource("funerarias", [requireAdmin]));

// clientes: funeraria can CRUD, empleado can read/update, admin all
router.use(
  "/clientes",
  resource("clientes", [ (req, res, next) => {
    // allow admin, funeraria, empleado with different methods
    const method = req.method;
    if (method === "GET") return next();
    // POST, PUT, DELETE require funeraria or admin
    return requireFuneraria(req, res, (err) => { if (err) return requireAdmin(req,res,next); next(); });
  }])
);

// empleados: funeraria registers employees; only funeraria and admin
router.use("/empleados", resource("empleados", [requireFuneraria]));

// usuarios: cliente_user can CRUD their users; admin can manage all
router.use("/usuarios", resource("usuarios", [ (req, res, next) => {
  // POST/PUT/DELETE: requireCliente or admin
  if (["POST","PUT","DELETE"].includes(req.method)) return requireCliente(req, res, (err) => { if (err) return requireAdmin(req,res,next); next(); });
  return next();
}]));

// familiares: cliente manages their familiares
router.use("/familiares", resource("familiares", [requireCliente]));

// recuerdos: cliente manages recuerdos
router.use("/recuerdos", resource("recuerdos", [requireCliente]));

// recuerdos_enviados: readonly generally; admin and funeraria read
router.use("/recuerdos_enviados", resource("recuerdos_enviados", []));

// clientes_usuarios: mapping table - restricted
router.use("/clientes_usuarios", resource("clientes_usuarios", [requireAdmin]));

export default router;
