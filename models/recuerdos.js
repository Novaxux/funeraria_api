import { userPool } from "../config/db.js";

// Get all recuerdos
export const getAllRecuerdos = async () => {
  const [rows] = await userPool.query(`
    SELECT id_recuerdo, id_cliente, titulo, texto, fecha_creacion, entregado, fecha_entrega
    FROM recuerdos
    WHERE entregado != -1
  `);
  return rows;
};

// Get recuerdo by ID
export const getRecuerdoById = async (id) => {
  const [rows] = await userPool.query(
    `SELECT id_recuerdo, id_cliente, titulo, texto, fecha_creacion, entregado, fecha_entrega
     FROM recuerdos
     WHERE id_recuerdo = ? AND entregado != -1`,
    [id]
  );
  return rows[0] || null;
};

// Create a new recuerdo
export const createRecuerdo = async ({ id_cliente, titulo, texto, entregado = 0, fecha_entrega = null }) => {
  const [result] = await userPool.execute(
    "INSERT INTO recuerdos (id_cliente, titulo, texto, entregado, fecha_entrega) VALUES (?, ?, ?, ?, ?)",
    [id_cliente, titulo, texto, entregado, fecha_entrega]
  );
  return { id_recuerdo: result.insertId, id_cliente, titulo, texto, entregado, fecha_entrega };
};

// Update a recuerdo
export const updateRecuerdo = async (id, { titulo, texto, entregado, fecha_entrega }) => {
  await userPool.execute(
    "UPDATE recuerdos SET titulo = ?, texto = ?, entregado = ?, fecha_entrega = ? WHERE id_recuerdo = ?",
    [titulo, texto, entregado, fecha_entrega, id]
  );
  return { id_recuerdo: id, titulo, texto, entregado, fecha_entrega };
};

// Logical delete of a recuerdo (set entregado = -1)
export const deleteRecuerdo = async (id) => {
  const [result] = await userPool.execute(
    "UPDATE recuerdos SET entregado = -1 WHERE id_recuerdo = ?",
    [id]
  );
  return result.affectedRows > 0;
};
