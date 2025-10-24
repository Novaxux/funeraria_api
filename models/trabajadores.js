import { userPool } from "../config/db.js";

// Get all workers
export const getAllWorkers = async () => {
  const [rows] = await userPool.query(`
    SELECT t.id_trabajador, t.id_usuario, t.puesto, u.estado_usuario
    FROM trabajadores t
    JOIN usuarios u ON t.id_usuario = u.id
  `);
  return rows;
};

// Get a worker by ID
export const getWorkerById = async (id) => {
  const [rows] = await userPool.query(
    `SELECT t.id_trabajador, t.id_usuario, t.puesto, u.estado_usuario
     FROM trabajadores t
     JOIN usuarios u ON t.id_usuario = u.id
     WHERE t.id_trabajador = ?`,
    [id]
  );
  return rows[0] || null;
};

// Create a new worker
export const createWorker = async ({ id_usuario, puesto }) => {
  const [result] = await userPool.execute(
    "INSERT INTO trabajadores (id_usuario, puesto) VALUES (?, ?)",
    [id_usuario, puesto]
  );
  return { id_trabajador: result.insertId, id_usuario, puesto };
};

// Update a worker
export const updateWorker = async (id, { puesto }) => {
  await userPool.execute(
    "UPDATE trabajadores SET puesto = ? WHERE id_trabajador = ?",
    [puesto, id]
  );
  return { id_trabajador: id, puesto };
};

// Logical delete of a worker (set estado_usuario to 0)
export const deleteWorker = async (id_usuario) => {
  const [result] = await userPool.execute(
    "UPDATE usuarios SET estado_usuario = 0 WHERE id = ?",
    [id_usuario]
  );
  return result.affectedRows > 0;
};
