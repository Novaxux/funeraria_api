export class ClientesRepository {
  /** Obtener todos los clientes */
  static async findAll(pool) {
    const [rows] = await pool.query(`
      SELECT 
        c.id_cliente, c.id_usuario, c.fecha_muerte, c.estado_vivo,
        c.fecha_asignacion, c.estado_cliente,
        u.nombre, u.correo, u.telefono
      FROM clientes c
      INNER JOIN usuarios u ON c.id_usuario = u.id
    `);
    return rows;
  }

  /** Obtener un cliente por ID */
  static async findById(pool, id) {
    const [rows] = await pool.query(
      `
      SELECT 
        c.id_cliente, c.id_usuario, c.fecha_muerte, c.estado_vivo,
        c.fecha_asignacion, c.estado_cliente,
        u.nombre, u.correo, u.telefono
      FROM clientes c
      INNER JOIN usuarios u ON c.id_usuario = u.id
      WHERE c.id_cliente = ?
    `,
      [id]
    );
    return rows[0];
  }

  /** Crear un nuevo cliente */
  static async create(pool, clienteData) {
    const {
      id_usuario,
      fecha_muerte = null,
      estado_vivo = 1,
      estado_cliente = "activo",
    } = clienteData;

    const [result] = await pool.query(
      `
      INSERT INTO clientes 
        (id_usuario, fecha_muerte, estado_vivo, estado_cliente)
      VALUES (?, ?, ?, ?)
    `,
      [id_usuario, fecha_muerte, estado_vivo, estado_cliente]
    );

    return { id_cliente: result.insertId, ...clienteData };
  }

  /** Actualizar un cliente */
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
      `UPDATE clientes SET ${fields.join(", ")} WHERE id_cliente = ?`,
      values
    );

    return { id_cliente: id, ...updates };
  }

  /** Desactivar un cliente (eliminación lógica) */
  static async delete(pool, id) {
    const [rows] = await pool.query(
      `SELECT * FROM clientes WHERE id_cliente = ?`,
      [id]
    );

    if (rows.length === 0) return null;

    await pool.query(
      `UPDATE clientes SET estado_cliente = 'inactivo' WHERE id_cliente = ?`,
      [id]
    );

    return { message: "Cliente desactivado correctamente" };
  }

  /** Reactivar un cliente */
  static async restore(pool, id) {
    const [rows] = await pool.query(
      `SELECT * FROM clientes WHERE id_cliente = ?`,
      [id]
    );

    if (rows.length === 0) return null;

    await pool.query(
      `UPDATE clientes SET estado_cliente = 'activo' WHERE id_cliente = ?`,
      [id]
    );

    return { message: "Cliente reactivado correctamente" };
  }
}
