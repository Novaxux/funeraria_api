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
      const user = await UsersRepository.findById(pool, req.params.id);
      if (!user)
        return res.status(404).json({ message: "Usuario no encontrado" });

      res.json(user);
    } catch (err) {
      console.error("getById usuario error:", err);
      res.status(500).json({ error: err.message });
    }
  },

  /** Buscar usuario por correo */
  async getByEmail(req, res) {
    try {
      const { correo } = req.params;
      const user = await UsersRepository.findByEmail(pool, correo);
      if (!user)
        return res.status(404).json({ message: "Usuario no encontrado" });

      res.json(user);
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

      // Validar campos obligatorios
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

      // Validar si ya existe un usuario con el mismo correo
      const existing = await UsersRepository.findByEmail(pool, correo);
      if (existing) {
        return res
          .status(409)
          .json({ message: "El correo ya está registrado por otro usuario" });
      }

      // Crear usuario
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

      res.status(201).json({
        message: "Usuario creado correctamente",
        ...data,
      });
    } catch (err) {
      console.error("create usuario error:", err);
      res.status(500).json({ error: err.message });
    }
  },

  /** Actualizar usuario */
  async patch(req, res) {
    try {
      const { id } = req.params;
      const updates = req.body;

      // Verificar que el usuario exista
      const existingUser = await UsersRepository.findById(pool, id);
      if (!existingUser)
        return res.status(404).json({ message: "Usuario no encontrado" });

      // Si se quiere actualizar el correo, verificar que no esté usado por otro
      if (updates.correo) {
        const correoExistente = await UsersRepository.findByEmail(
          pool,
          updates.correo
        );
        if (correoExistente && correoExistente.id !== parseInt(id)) {
          return res
            .status(409)
            .json({ message: "Ese correo ya está en uso por otro usuario" });
        }
      }

      // Actualizar
      const updated = await UsersRepository.update(pool, id, updates);
      res.json({ message: "Usuario actualizado correctamente", ...updated });
    } catch (err) {
      console.error("update usuario error:", err);
      res.status(500).json({ error: err.message });
    }
  },

  /** Desactivar usuario (eliminación lógica) */
  async remove(req, res) {
    try {
      const { id } = req.params;

      // Verificar que el usuario exista
      const user = await UsersRepository.findById(pool, id);
      if (!user)
        return res.status(404).json({ message: "Usuario no encontrado" });

      // Si ya está desactivado, avisar
      if (user.estado_usuario === 0) {
        return res
          .status(400)
          .json({ message: "El usuario ya está desactivado" });
      }

      const data = await UsersRepository.delete(pool, id);
      res.json({ message: "Usuario desactivado correctamente", ...data });
    } catch (err) {
      console.error("remove usuario error:", err);
      res.status(500).json({ error: err.message });
    }
  },

  /** Reactivar usuario */
  async restore(req, res) {
    try {
      const { id } = req.params;
      const user = await UsersRepository.findById(pool, id);

      if (!user)
        return res.status(404).json({ message: "Usuario no encontrado" });

      if (user.estado_usuario === 1) {
        return res.status(400).json({ message: "El usuario ya está activo" });
      }

      const data = await UsersRepository.restore(pool, id);
      res.json({ message: "Usuario reactivado correctamente", ...data });
    } catch (err) {
      console.error("restore usuario error:", err);
      res.status(500).json({ error: err.message });
    }
  },
};
