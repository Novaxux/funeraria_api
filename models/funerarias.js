import { userPool } from "../config/db.js";

// Get all funerarias
export const getAllFunerarias = async () => {
  const [rows] = await userPool.query(
    "SELECT id_funeraria, nombre, direccion, telefono, correo_contacto, estado_funeraria FROM funerarias WHERE estado_funeraria != 0"
  );
  return rows;
};

// Get a funeraria by ID
export const getFunerariaById = async (id) => {
  const [rows] = await userPool.query(
    "SELECT id_funeraria, nombre, direccion, telefono, correo_contacto, estado_funeraria FROM funerarias WHERE id_funeraria = ? AND estado_funeraria != 0",
    [id]
  );
  return rows[0] || null;
};

// Create a new funeraria
export const createFuneraria = async ({ nombre, direccion, telefono, correo_contacto }) => {
  const [result] = await userPool.execute(
    "INSERT INTO funerarias (nombre, direccion, telefono, correo_contacto) VALUES (?, ?, ?, ?)",
    [nombre, direccion, telefono, correo_contacto]
  );
  return { id_funeraria: result.insertId, nombre, direccion, telefono, correo_contacto, estado_funeraria: 1 };
};

// Update a funeraria
export const updateFuneraria = async (id, { nombre, direccion, telefono, correo_contacto }) => {
  await userPool.execute(
    "UPDATE funerarias SET nombre = ?, direccion = ?, telefono = ?, correo_contacto = ? WHERE id_funeraria = ?",
    [nombre, direccion, telefono, correo_contacto, id]
  );
  return { id_funeraria: id, nombre, direccion, telefono, correo_contacto };
};

// Logical delete of a funeraria (set estado_funeraria = 0)
export const deleteFuneraria = async (id) => {
  const [result] = await userPool.execute(
    "UPDATE funerarias SET estado_funeraria = 0 WHERE id_funeraria = ?",
    [id]
  );
  return result.affectedRows > 0;
};
