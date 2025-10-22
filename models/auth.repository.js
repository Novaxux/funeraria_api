import { userPool as pool } from '../config/db.js';

export const login = async (table, email, password, idField) => {
    const [rows] = await pool.query(`SELECT * FROM ${table} WHERE email = ? AND password = ?`, [email, password]);
    return rows[0];
};