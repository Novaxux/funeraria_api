import { pool } from "../config/db.js";
import { ClientesRepository } from "../models/clientesRepository.js";
import { UsersRepository } from "../models/usuariosRepository.js";

export const ClientesController = {
  /** Obtener todos los clientes */
  async getAll(req, res) {
    try {
      const data = await ClientesRepository.findAll(pool);
      res.json(data);
    } catch (err) {
      console.error("getAll clientes error:", err);
      res.status(500).json({ error: err.message });
    }
  },

  /** Obtener cliente por ID */
  async getById(req, res) {
    try {
      const cliente = await ClientesRepository.findById(pool, req.params.id);
      if (!cliente)
        return res.status(404).json({ message: "Cliente no encontrado" });

      res.json(cliente);
    } catch (err) {
      console.error("getById cliente error:", err);
      res.status(500).json({ error: err.message });
    }
  },

  /** Crear un nuevo cliente (crea usuario automáticamente) */
  async create(req, res) {
    const connection = await pool.getConnection();
    await connection.beginTransaction();

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
        fecha_muerte,
        estado_vivo,
        estado_cliente,
      } = req.body;

      // Validar campos obligatorios del usuario
      if (
        !nombre ||
        !fecha_nacimiento ||
        !genero ||
        !rol ||
        !correo ||
        !telefono ||
        !contrasena
      ) {
        await connection.rollback();
        connection.release();
        return res
          .status(400)
          .json({ message: "Todos los campos obligatorios deben completarse" });
      }

      // Validar si ya existe un usuario con ese correo
      const existingUser = await UsersRepository.findByEmail(pool, correo);
      if (existingUser) {
        await connection.rollback();
        connection.release();
        return res
          .status(409)
          .json({ message: "El correo ya está registrado por otro usuario" });
      }

      // Crear usuario primero
      const nuevoUsuario = await UsersRepository.create(connection, {
        nombre,
        fecha_nacimiento,
        genero,
        rol,
        correo,
        telefono,
        contrasena,
        id_funeraria,
      });

      // Validar que no exista ya un cliente con ese usuario (no debería, pero se valida)
      const [clienteExistente] = await connection.query(
        `SELECT * FROM clientes WHERE id_usuario = ?`,
        [nuevoUsuario.id]
      );

      if (clienteExistente.length > 0) {
        await connection.rollback();
        connection.release();
        return res.status(409).json({
          message: "Ya existe un cliente vinculado a ese usuario",
        });
      }

      // Crear cliente
      const nuevoCliente = await ClientesRepository.create(connection, {
        id_usuario: nuevoUsuario.id,
        fecha_muerte,
        estado_vivo,
        estado_cliente,
      });

      await connection.commit();
      connection.release();

      res.status(201).json({
        message: "Cliente y usuario creados correctamente",
        usuario: nuevoUsuario,
        cliente: nuevoCliente,
      });
    } catch (err) {
      await connection.rollback();
      connection.release();
      console.error("create cliente error:", err);
      res.status(500).json({ error: err.message });
    }
  },

  /** Actualizar datos de cliente y/o usuario vinculado */
  async patch(req, res) {
    const connection = await pool.getConnection();
    await connection.beginTransaction();

    try {
      const { id } = req.params;
      const updates = req.body;

      // Verificar que el cliente exista
      const cliente = await ClientesRepository.findById(pool, id);
      if (!cliente) {
        await connection.rollback();
        connection.release();
        return res.status(404).json({ message: "Cliente no encontrado" });
      }

      // Si se envían campos del usuario, actualizarlos
      const userUpdates = {};
      const clienteUpdates = {};

      const camposUsuario = [
        "nombre",
        "fecha_nacimiento",
        "genero",
        "rol",
        "correo",
        "telefono",
        "contrasena",
        "id_funeraria",
      ];

      const camposCliente = ["fecha_muerte", "estado_vivo", "estado_cliente"];

      for (const [key, value] of Object.entries(updates)) {
        if (camposUsuario.includes(key)) userUpdates[key] = value;
        if (camposCliente.includes(key)) clienteUpdates[key] = value;
      }

      // Si hay cambios de usuario, procesarlos
      if (Object.keys(userUpdates).length > 0) {
        // Validar que no haya conflicto de correo
        if (userUpdates.correo) {
          const correoExistente = await UsersRepository.findByEmail(
            pool,
            userUpdates.correo
          );
          if (correoExistente && correoExistente.id !== cliente.id_usuario) {
            await connection.rollback();
            connection.release();
            return res
              .status(409)
              .json({ message: "Ese correo ya está en uso por otro usuario" });
          }
        }

        await UsersRepository.update(
          connection,
          cliente.id_usuario,
          userUpdates
        );
      }

      // Si hay cambios de cliente, procesarlos
      if (Object.keys(clienteUpdates).length > 0) {
        await ClientesRepository.update(connection, id, clienteUpdates);
      }

      await connection.commit();
      connection.release();

      res.json({ message: "Cliente actualizado correctamente" });
    } catch (err) {
      await connection.rollback();
      connection.release();
      console.error("update cliente error:", err);
      res.status(500).json({ error: err.message });
    }
  },

  /** Desactivar cliente (lógico) */
  async remove(req, res) {
    try {
      const { id } = req.params;
      const cliente = await ClientesRepository.findById(pool, id);

      if (!cliente)
        return res.status(404).json({ message: "Cliente no encontrado" });

      if (cliente.estado_cliente === "inactivo") {
        return res.status(400).json({ message: "El cliente ya está inactivo" });
      }

      const data = await ClientesRepository.delete(pool, id);
      res.json({ message: "Cliente desactivado correctamente", ...data });
    } catch (err) {
      console.error("remove cliente error:", err);
      res.status(500).json({ error: err.message });
    }
  },

  /** Reactivar cliente */
  async restore(req, res) {
    try {
      const { id } = req.params;
      const cliente = await ClientesRepository.findById(pool, id);

      if (!cliente)
        return res.status(404).json({ message: "Cliente no encontrado" });

      if (cliente.estado_cliente === "activo") {
        return res.status(400).json({ message: "El cliente ya está activo" });
      }

      const data = await ClientesRepository.restore(pool, id);
      res.json({ message: "Cliente reactivado correctamente", ...data });
    } catch (err) {
      console.error("restore cliente error:", err);
      res.status(500).json({ error: err.message });
    }
  },
};
