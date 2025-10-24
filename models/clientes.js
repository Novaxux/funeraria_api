import { userPool } from "../config/db.js";

// Get all clients
export const getAllClients = async () => {
  const [rows] = await userPool.query(`
    SELECT c.id_cliente, c.id_usuario, c.fecha_muerte, c.estado_vivo, 
           c.fecha_asignacion, c.estado_cliente
    FROM clientes c
  `);
  return rows;
};

// Get a client by ID
export const getClientById = async (id) => {
  const [rows] = await userPool.query(
    "SELECT id_cliente, id_usuario, fecha_muerte, estado_vivo, fecha_asignacion, estado_cliente FROM clientes WHERE id_cliente = ?",
    [id]
  );
  return rows[0] || null;
};

// Create a new client
export const createClient = async ({ id_usuario, fecha_muerte = null, estado_vivo = 1, estado_cliente = 'activo' }) => {
  const [result] = await userPool.execute(
    "INSERT INTO clientes (id_usuario, fecha_muerte, estado_vivo, estado_cliente) VALUES (?, ?, ?, ?)",
    [id_usuario, fecha_muerte, estado_vivo, estado_cliente]
  );
  return { id_cliente: result.insertId, id_usuario, fecha_muerte, estado_vivo, estado_cliente };
};

// Update a client
export const updateClient = async (id, { fecha_muerte, estado_vivo, estado_cliente }) => {
  await userPool.execute(
    "UPDATE clientes SET fecha_muerte = ?, estado_vivo = ?, estado_cliente = ? WHERE id_cliente = ?",
    [fecha_muerte, estado_vivo, estado_cliente, id]
  );
  return { id_cliente: id, fecha_muerte, estado_vivo, estado_cliente };
};

// Delete a client (logical deletion could also be applied by changing estado_cliente)
export const deleteClient = async (id) => {
  const [result] = await userPool.execute(
  "UPDATE clientes SET estado_cliente = 'inactivo' WHERE id_cliente = ?",
  [id]
  );
  return result.affectedRows > 0;
};
