import { UsersRepository } from "../models/usuariosRepository.js";
import { pool } from "../config/db.js";

export const UsersController = {
  /** Listar todos los usuarios */
  async getAll(req, res) {
    try {
      const data = await UsersRepository.findAll(pool);
      res.json(data);
    } catch (err) {
      console.error("getAll usuarios error:", err);
      res.status(500).json({ error: err.message });
    }
  },

  /** Obtener usuario por ID */
  async getById(req, res) {
    try {
      const data = await UsersRepository.findById(pool, req.params.id);
      if (!data)
        return res.status(404).json({ message: "Usuario no encontrado" });
      res.json(data);
    } catch (err) {
      console.error("getById usuario error:", err);
      res.status(500).json({ error: err.message });
    }
  },

  /** Buscar usuario por correo */
  async getByEmail(req, res) {
    try {
      const { correo } = req.params;
      const data = await UsersRepository.findByEmail(pool, correo);
      if (!data)
        return res.status(404).json({ message: "Usuario no encontrado" });
      res.json(data);
    } catch (err) {
      console.error("getByEmail usuario error:", err);
      res.status(500).json({ error: err.message });
    }
  },

  /** Crear nuevo usuario */
  async create(req, res) {
    try {
      const {
        nombre,
        fecha_nacimiento,
        genero,
        rol,
        correo,
        telefono,
        contrasena,
        id_funeraria,
      } = req.body;

      if (
        !nombre ||
        !fecha_nacimiento ||
        !genero ||
        !rol ||
        !correo ||
        !telefono ||
        !contrasena
      ) {
        return res
          .status(400)
          .json({ message: "Todos los campos obligatorios deben completarse" });
      }

      const data = await UsersRepository.create(pool, {
        nombre,
        fecha_nacimiento,
        genero,
        rol,
        correo,
        telefono,
        contrasena,
        id_funeraria,
      });

      res
        .status(201)
        .json({ message: "Usuario creado correctamente", ...data });
    } catch (err) {
      console.error("create usuario error:", err);
      res.status(500).json({ error: err.message });
    }
  },

  /** Actualizar usuario */
  async patch(req, res) {
    try {
      const { id } = req.params;
      const updated = await UsersRepository.update(pool, id, req.body);
      if (!updated)
        return res.status(404).json({ message: "Usuario no encontrado" });

      res.json({ message: "Usuario actualizado correctamente", ...updated });
    } catch (err) {
      console.error("update usuario error:", err);
      res.status(500).json({ error: err.message });
    }
  },

  /** Desactivar usuario (eliminación lógica) */
  async remove(req, res) {
    try {
      const data = await UsersRepository.delete(pool, req.params.id);
      if (!data)
        return res.status(404).json({ message: "Usuario no encontrado" });

      res.json(data);
    } catch (err) {
      console.error("remove usuario error:", err);
      res.status(500).json({ error: err.message });
    }
  },

  /** Reactivar usuario */
  async restore(req, res) {
    try {
      const data = await UsersRepository.restore(pool, req.params.id);
      if (!data)
        return res.status(404).json({ message: "Usuario no encontrado" });

      res.json(data);
    } catch (err) {
      console.error("restore usuario error:", err);
      res.status(500).json({ error: err.message });
    }
  },
};
