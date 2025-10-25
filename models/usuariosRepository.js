export class UsersRepository {
  /** Obtener todos los usuarios */
  static async findAll(pool) {
    const [rows] = await pool.query(`
      SELECT 
        id, nombre, fecha_nacimiento, genero, rol, correo, telefono, 
        estado_usuario, id_funeraria
      FROM usuarios
    `);
    return rows;
  }

  /** Obtener un usuario por ID */
  static async findById(pool, id) {
    const [rows] = await pool.query(
      `
      SELECT 
        id, nombre, fecha_nacimiento, genero, rol, correo, telefono, 
        estado_usuario, id_funeraria
      FROM usuarios
      WHERE id = ?
    `,
      [id]
    );
    return rows[0];
  }

  /** Buscar usuario por correo */
  static async findByEmail(pool, correo) {
    const [rows] = await pool.query(`SELECT * FROM usuarios WHERE correo = ?`, [
      correo,
    ]);
    return rows[0];
  }

  /** Crear un nuevo usuario */
  static async create(pool, usuarioData) {
    const {
      nombre,
      fecha_nacimiento,
      genero,
      rol,
      correo,
      telefono,
      contrasena,
      id_funeraria = null,
    } = usuarioData;

    const [result] = await pool.query(
      `
      INSERT INTO usuarios 
        (nombre, fecha_nacimiento, genero, rol, correo, telefono, contrasena, id_funeraria)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `,
      [
        nombre,
        fecha_nacimiento,
        genero,
        rol,
        correo,
        telefono,
        contrasena,
        id_funeraria,
      ]
    );

    return { id: result.insertId, ...usuarioData };
  }

  /** Actualizar un usuario */
  static async update(pool, id, updates) {
    const fields = [];
    const values = [];

    for (const [key, value] of Object.entries(updates)) {
      fields.push(`${key} = ?`);
      values.push(value);
    }

    if (fields.length === 0) return null;

    values.push(id);

    await pool.query(
      `UPDATE usuarios SET ${fields.join(", ")} WHERE id = ?`,
      values
    );

    return { id, ...updates };
  }

  /** Desactivar un usuario (eliminación lógica) */
  static async delete(pool, id) {
    // Verificar si existe el registro
    const [rows] = await pool.query(`SELECT * FROM usuarios WHERE id = ?`, [
      id,
    ]);

    if (rows.length === 0) {
      return null; // No existe
    }

    // Desactivar el usuario
    await pool.query(`UPDATE usuarios SET estado_usuario = 0 WHERE id = ?`, [
      id,
    ]);

    return { message: "Usuario desactivado correctamente" };
  }

  /** Reactivar usuario (opcional) */
  static async restore(pool, id) {
    const [rows] = await pool.query(`SELECT * FROM usuarios WHERE id = ?`, [
      id,
    ]);

    if (rows.length === 0) {
      return null;
    }

    await pool.query(`UPDATE usuarios SET estado_usuario = 1 WHERE id = ?`, [
      id,
    ]);

    return { message: "Usuario reactivado correctamente" };
  }
}
