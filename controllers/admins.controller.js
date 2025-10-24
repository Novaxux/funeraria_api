import { AdminsRepository } from "../models/adminsRepository.js";

export const AdminsController = {
  /** Obtener todos los administradores */
  async getAll(req, res) {
    try {
      const data = await AdminsRepository.findAll(req.pool);
      res.json(data);
    } catch (err) {
      console.error("getAll admins error:", err);
      res.status(500).json({ error: err.message });
    }
  },

  /** Obtener un administrador por ID */
  async getById(req, res) {
    try {
      const data = await AdminsRepository.findById(req.pool, req.params.id);
      if (!data)
        return res.status(404).json({ message: "Administrador no encontrado" });
      res.json(data);
    } catch (err) {
      console.error("getById admin error:", err);
      res.status(500).json({ error: err.message });
    }
  },

  /** Crear un nuevo administrador usando el usuario autenticado */
  async create(req, res) {
    try {
      const user = req.user;
      if (!user) return res.status(401).json({ message: "No autenticado" });

      // Solo los admins globales pueden crear otro admin
      if (user.role_id !== 1) {
        return res
          .status(403)
          .json({ message: "Acceso denegado, se requiere rol administrador" });
      }

      const { id_usuario } = req.body;
      if (!id_usuario)
        return res.status(400).json({ message: "id_usuario es requerido" });

      const exists = await AdminsRepository.findByUserId(req.pool, id_usuario);
      if (exists)
        return res
          .status(400)
          .json({ message: "Este usuario ya está registrado como admin" });

      const data = await AdminsRepository.create(req.pool, id_usuario);
      res
        .status(201)
        .json({ message: "Administrador creado exitosamente", ...data });
    } catch (err) {
      console.error("create admin error:", err);
      res.status(500).json({ error: err.message });
    }
  },

  /** Eliminar un administrador */
  async remove(req, res) {
    try {
      const user = req.user;
      if (!user) return res.status(401).json({ message: "No autenticado" });

      if (user.role_id !== 1) {
        return res
          .status(403)
          .json({ message: "Acceso denegado, se requiere rol administrador" });
      }

      const data = await AdminsRepository.delete(req.pool, req.params.id);
      res.json(data);
    } catch (err) {
      console.error("remove admin error:", err);
      res.status(500).json({ error: err.message });
    }
  },
};
