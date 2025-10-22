import { userPool as pool } from '../config/db.js';

export const getAll = async (table) => {
    const [rows] = await pool.query(`SELECT * FROM ${table}`);
    return rows;
};

export const getById = async (table, id) => {
    const [rows] = await pool.query(`SELECT * FROM ${table} WHERE id = ?`, [id]);
    return rows[0];
};

export const create = async (table, data) => {
    const columns = Object.keys(data).join(', ');
    const values = Object.values(data);
    const placeholders = values.map(() => '?').join(', ');
    const [result] = await pool.query(`INSERT INTO ${table} (${columns}) VALUES (${placeholders})`, values);
    return { id: result.insertId, ...data };
};

export const update = async (table, id, data) => {
    const columns = Object.keys(data).map(key => `${key} = ?`).join(', ');
    const values = [...Object.values(data), id];
    await pool.query(`UPDATE ${table} SET ${columns} WHERE id = ?`, values);
    return { id, ...data };
};

export const remove = async (table, id) => {
    await pool.query(`DELETE FROM ${table} WHERE id = ?`, [id]);
    return { id };
};