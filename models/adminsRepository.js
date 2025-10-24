export class AdminsRepository {
  /** Obtener todos los administradores (con datos del usuario asociado) */
  static async findAll(pool) {
    const [rows] = await pool.query(`
      SELECT a.id_admin, a.id_usuario, u.nombre, u.correo, u.telefono, u.rol, u.estado_usuario
      FROM admins a
      INNER JOIN usuarios u ON a.id_usuario = u.id
    `);
    return rows;
  }

  /** Obtener un administrador por ID */
  static async findById(pool, id_admin) {
    const [rows] = await pool.query(
      `
      SELECT a.id_admin, a.id_usuario, u.nombre, u.correo, u.telefono, u.rol, u.estado_usuario
      FROM admins a
      INNER JOIN usuarios u ON a.id_usuario = u.id
      WHERE a.id_admin = ?
    `,
      [id_admin]
    );
    return rows[0];
  }

  /** Buscar si un usuario ya es admin */
  static async findByUserId(pool, id_usuario) {
    const [rows] = await pool.query(
      `SELECT * FROM admins WHERE id_usuario = ?`,
      [id_usuario]
    );
    return rows[0];
  }

  /** Crear registro de administrador */
  static async create(pool, id_usuario) {
    const [result] = await pool.query(
      `INSERT INTO admins (id_usuario) VALUES (?)`,
      [id_usuario]
    );
    return { id_admin: result.insertId, id_usuario };
  }

  /** Eliminar registro */
  static async delete(pool, id_admin) {
    await pool.query(`DELETE FROM admins WHERE id_admin = ?`, [id_admin]);
    return { message: "Administrador eliminado correctamente" };
  }
}
