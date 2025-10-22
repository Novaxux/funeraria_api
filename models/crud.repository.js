// Generic CRUD repository using parameterized queries.
export class CrudRepository {
  constructor(tableName) {
    this.table = tableName;
  }

  async list(pool, where = "", params = []) {
    const sql = `SELECT * FROM ${this.table} ${where}`;
    const [rows] = await pool.query(sql, params);
    return rows;
  }

  async getById(pool, id) {
    const sql = `SELECT * FROM ${this.table} WHERE id = ?`;
    const [rows] = await pool.query(sql, [id]);
    return rows.length ? rows[0] : null;
  }

  async create(pool, data) {
    const keys = Object.keys(data);
    const placeholders = keys.map(() => "?").join(",");
    const sql = `INSERT INTO ${this.table} (${keys.join(",")}) VALUES (${placeholders})`;
    const [result] = await pool.execute(sql, keys.map((k) => data[k]));
    return result.insertId;
  }

  async update(pool, id, data) {
    const keys = Object.keys(data);
    const assignments = keys.map((k) => `${k} = ?`).join(",");
    const sql = `UPDATE ${this.table} SET ${assignments} WHERE id = ?`;
    const params = keys.map((k) => data[k]).concat([id]);
    const [result] = await pool.execute(sql, params);
    return result.affectedRows;
  }

  async delete(pool, id) {
    const sql = `DELETE FROM ${this.table} WHERE id = ?`;
    const [result] = await pool.execute(sql, [id]);
    return result.affectedRows;
  }
}
