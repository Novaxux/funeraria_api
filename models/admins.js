import { adminPool } from "../config/db.js";

export class AdminModel {
  // Create a new admin and return the inserted ID
  static async createAdmin({ name, email, password }) {
    const sql = `
      INSERT INTO admins (name, email, password)
      VALUES (?, ?, ?)
    `;
    const [result] = await adminPool.execute(sql, [name, email, password]);
    return result.insertId;
  }

  // Get all admins
  static async getAllAdmins() {
    const sql = `SELECT id_admin, name, email FROM admins`;
    const [rows] = await adminPool.query(sql);
    return rows;
  }

  // Get admin by ID
  static async getAdminById(id_admin) {
    const sql = `
      SELECT id_admin, name, email
      FROM admins
      WHERE id_admin = ?
    `;
    const [rows] = await adminPool.query(sql, [id_admin]);
    return rows.length ? rows[0] : null;
  }

  // Update admin information
  static async updateAdmin(id_admin, { name, email, password }) {
    const sql = `
      UPDATE admins
      SET name = ?, email = ?, password = ?
      WHERE id_admin = ?
    `;
    const [result] = await adminPool.execute(sql, [name, email, password, id_admin]);
    return result.affectedRows > 0;
  }

  // Delete admin by ID
  static async deleteAdmin(id_admin) {
    const sql = `DELETE FROM admins WHERE id_admin = ?`;
    const [result] = await adminPool.execute(sql, [id_admin]);
    return result.affectedRows > 0;
  }

  // Find admin by email (useful for login)
  static async getAdminByEmail(email) {
    const sql = `
      SELECT id_admin, name, email, password
      FROM admins
      WHERE email = ?
    `;
    const [rows] = await adminPool.query(sql, [email]);
    return rows.length ? rows[0] : null;
  }
}
