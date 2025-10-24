import { userPool } from "../config/db.js";

// Get all delivery records
export const getAllRecuerdosFamiliares = async () => {
  const [rows] = await userPool.query(`
    SELECT id_entrega, id_recuerdo, id_familiar, fecha_envio, metodo_envio, estatus_envio
    FROM recuerdos_familiares
  `);
  return rows;
};

// Get a delivery record by ID
export const getRecuerdoFamiliarById = async (id) => {
  const [rows] = await userPool.query(
    "SELECT id_entrega, id_recuerdo, id_familiar, fecha_envio, metodo_envio, estatus_envio FROM recuerdos_familiares WHERE id_entrega = ?",
    [id]
  );
  return rows[0] || null;
};

// Create a new delivery record
export const createRecuerdoFamiliar = async ({ id_recuerdo, id_familiar, metodo_envio = 'Correo', estatus_envio = 'Pendiente' }) => {
  const [result] = await userPool.execute(
    "INSERT INTO recuerdos_familiares (id_recuerdo, id_familiar, metodo_envio, estatus_envio) VALUES (?, ?, ?, ?)",
    [id_recuerdo, id_familiar, metodo_envio, estatus_envio]
  );
  return { id_entrega: result.insertId, id_recuerdo, id_familiar, metodo_envio, estatus_envio };
};

// Update a delivery record
export const updateRecuerdoFamiliar = async (id, { metodo_envio, estatus_envio }) => {
  await userPool.execute(
    "UPDATE recuerdos_familiares SET metodo_envio = ?, estatus_envio = ? WHERE id_entrega = ?",
    [metodo_envio, estatus_envio, id]
  );
  return { id_entrega: id, metodo_envio, estatus_envio };
};

// Delete a delivery record (physical deletion)
export const deleteRecuerdoFamiliar = async (id) => {
  const [result] = await userPool.execute(
    "DELETE FROM recuerdos_familiares WHERE id_entrega = ?",
    [id]
  );
  return result.affectedRows > 0;
};
