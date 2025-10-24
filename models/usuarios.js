import { userPool } from "../config/db.js";

// Get all active users
export const getAllUsuarios = async () => {
  const [rows] = await userPool.query(
    "SELECT id, nombre, fecha_nacimiento, genero, rol, correo, telefono, estado_usuario, id_funeraria FROM usuarios WHERE estado_usuario != 0"
  );
  return rows;
};

// Get user by ID
export const getUsuarioById = async (id) => {
  const [rows] = await userPool.query(
    "SELECT id, nombre, fecha_nacimiento, genero, rol, correo, telefono, estado_usuario, id_funeraria FROM usuarios WHERE id = ? AND estado_usuario != 0",
    [id]
  );
  return rows[0] || null;
};

// Create a new user
export const createUsuario = async ({ nombre, fecha_nacimiento, genero, rol, correo, telefono, contrasena, id_funeraria = null }) => {
  const [result] = await userPool.execute(
    "INSERT INTO usuarios (nombre, fecha_nacimiento, genero, rol, correo, telefono, contrasena, id_funeraria) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
    [nombre, fecha_nacimiento, genero, rol, correo, telefono, contrasena, id_funeraria]
  );
  return { id: result.insertId, nombre, fecha_nacimiento, genero, rol, correo, telefono, estado_usuario: 1, id_funeraria };
};

// Update a user
export const updateUsuario = async (id, { nombre, fecha_nacimiento, genero, rol, correo, telefono, contrasena, id_funeraria }) => {
  await userPool.execute(
    "UPDATE usuarios SET nombre = ?, fecha_nacimiento = ?, genero = ?, rol = ?, correo = ?, telefono = ?, contrasena = ?, id_funeraria = ? WHERE id = ?",
    [nombre, fecha_nacimiento, genero, rol, correo, telefono, contrasena, id_funeraria, id]
  );
  return { id, nombre, fecha_nacimiento, genero, rol, correo, telefono, id_funeraria };
};

// Logical delete of a user (set estado_usuario = 0)
export const deleteUsuario = async (id) => {
  const [result] = await userPool.execute(
    "UPDATE usuarios SET estado_usuario = 0 WHERE id = ?",
    [id]
  );
  return result.affectedRows > 0;
};
