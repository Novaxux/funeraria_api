import { adminPool } from "../config/db.js";

// Get all admins
export const getAllAdmins = async () => {
  const [rows] = await adminPool.query("SELECT id_admin, name, email FROM admins");
  return rows;
};

// Get an admin by ID
export const getAdminById = async (id) => {
  const [rows] = await adminPool.query(
    "SELECT id_admin, name, email FROM admins WHERE id_admin = ?",
    [id]
  );
  return rows[0] || null;
};

// Create a new admin
export const createAdmin = async ({ name, email, password }) => {
  const [result] = await adminPool.execute(
    "INSERT INTO admins (name, email, password) VALUES (?, ?, ?)",
    [name, email, password]
  );
  return { id_admin: result.insertId, name, email };
};

// Update an admin
export const updateAdmin = async (id, { name, email, password }) => {
  await adminPool.execute(
    "UPDATE admins SET name = ?, email = ?, password = ? WHERE id_admin = ?",
    [name, email, password, id]
  );
  return { id_admin: id, name, email };
};

// Delete an admin
export const deleteAdmin = async (id) => {
  const [result] = await adminPool.execute("DELETE FROM admins WHERE id_admin = ?", [id]);
  return result.affectedRows > 0;
};

// Get admin by email (for login)
export const getAdminByEmail = async (email) => {
  const [rows] = await adminPool.query(
    "SELECT id_admin, name, email, password FROM admins WHERE email = ?",
    [email]
  );
  return rows[0] || null;
};
