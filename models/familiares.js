import { userPool } from "../config/db.js";

// Get all familiares
export const getAllFamiliares = async () => {
  const [rows] = await userPool.query(`
    SELECT id_familiar, id_cliente, nombre, parentesco, edad, telefono, correo
    FROM familiares
  `);
  return rows;
};

// Get familiar by ID
export const getFamiliarById = async (id) => {
  const [rows] = await userPool.query(
    "SELECT id_familiar, id_cliente, nombre, parentesco, edad, telefono, correo FROM familiares WHERE id_familiar = ?",
    [id]
  );
  return rows[0] || null;
};

// Create a new familiar
export const createFamiliar = async ({ id_cliente, nombre, parentesco, edad = null, telefono, correo }) => {
  const [result] = await userPool.execute(
    "INSERT INTO familiares (id_cliente, nombre, parentesco, edad, telefono, correo) VALUES (?, ?, ?, ?, ?, ?)",
    [id_cliente, nombre, parentesco, edad, telefono, correo]
  );
  return { id_familiar: result.insertId, id_cliente, nombre, parentesco, edad, telefono, correo };
};

// Update a familiar
export const updateFamiliar = async (id, { nombre, parentesco, edad, telefono, correo }) => {
  await userPool.execute(
    "UPDATE familiares SET nombre = ?, parentesco = ?, edad = ?, telefono = ?, correo = ? WHERE id_familiar = ?",
    [nombre, parentesco, edad, telefono, correo, id]
  );
  return { id_familiar: id, nombre, parentesco, edad, telefono, correo };
};

// Delete a familiar (physical deletion)
export const deleteFamiliar = async (id) => {
  const [result] = await userPool.execute(
    "DELETE FROM familiares WHERE id_familiar = ?",
    [id]
  );
  return result.affectedRows > 0;
};
