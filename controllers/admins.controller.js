import { AdminsRepository } from "../models/adminsRepository.js";
import { pool } from "../config/db.js";

export const AdminsController = {
  /** Obtener todos los administradores */
  async getAll(req, res) {
    try {
      const data = await AdminsRepository.findAll(pool);
      res.json(data);
    } catch (err) {
      console.error("getAll admins error:", err);
      res.status(500).json({ error: err.message });
    }
  },

  /** Obtener un administrador por ID */
  async getById(req, res) {
    try {
      const data = await AdminsRepository.findById(pool, req.params.id);
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
      const { id_usuario } = req.body;
      if (!id_usuario)
        return res.status(400).json({ message: "id_usuario es requerido" });

      const exists = await AdminsRepository.findByUserId(pool, id_usuario);
      if (exists)
        return res
          .status(400)
          .json({ message: "Este usuario ya está registrado como admin" });

      const data = await AdminsRepository.create(pool, id_usuario);
      res
        .status(201)
        .json({ message: "Administrador creado exitosamente", ...data });
    } catch (err) {
      console.error("create admin error:", err);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },

  /** Eliminar un administrador */
  async remove(req, res) {
    try {
      const result = await AdminsRepository.delete(pool, req.params.id);

      if (!result) {
        return res.status(404).json({ message: "Administrador no encontrado" });
      }

      res.json(result);
    } catch (err) {
      console.error("remove admin error:", err);
      res.status(500).json({ error: err.message });
    }
  },
};
