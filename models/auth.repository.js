export class AuthRepository {
  // Create a new user and return insertId
  static async createUser(pool, { username, password, role_id = 2 }) {
    const sql = `INSERT INTO users (username, password, role_id) VALUES (?, ?, ?)`;
    const [result] = await pool.execute(sql, [username, password, role_id]);
    return result.insertId;
  }

  static async getUserByUsername(pool, username) {
    const sql = `SELECT id, username, password, role_id FROM users WHERE username = ?`;
    const [rows] = await pool.query(sql, [username]);
    return rows.length ? rows[0] : null;
  }

  static async getUserById(pool, id) {
    const sql = `SELECT id, username, role_id FROM users WHERE id = ?`;
    const [rows] = await pool.query(sql, [id]);
    return rows.length ? rows[0] : null;
  }
}
