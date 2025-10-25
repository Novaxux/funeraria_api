export class FunerariasRepository {
  /** Obtener todas las funerarias */
  static async findAll(pool) {
    const [rows] = await pool.query(`
      SELECT id_funeraria, nombre, direccion, telefono, correo_contacto, estado_funeraria
      FROM funerarias
    `);
    return rows;
  }

  /** Obtener una funeraria por ID */
  static async findById(pool, id_funeraria) {
    const [rows] = await pool.query(
      `SELECT id_funeraria, nombre, direccion, telefono, correo_contacto, estado_funeraria
       FROM funerarias
       WHERE id_funeraria = ?`,
      [id_funeraria]
    );
    return rows[0];
  }

  /** Crear una funeraria nueva */
  static async create(pool, { nombre, direccion, telefono, correo_contacto }) {
    const [result] = await pool.query(
      `INSERT INTO funerarias (nombre, direccion, telefono, correo_contacto)
       VALUES (?, ?, ?, ?)`,
      [nombre, direccion, telefono, correo_contacto]
    );
    return {
      id_funeraria: result.insertId,
      nombre,
      direccion,
      telefono,
      correo_contacto,
    };
  }

  /** Actualizar funeraria */
  static async patch(pool, id_funeraria, data) {
    // Construimos dinámicamente los campos a actualizar
    const fields = [];
    const values = [];

    for (const key of [
      "nombre",
      "direccion",
      "telefono",
      "correo_contacto",
      "estado_funeraria",
    ]) {
      if (data[key] !== undefined) {
        fields.push(`${key} = ?`);
        values.push(data[key]);
      }
    }

    if (fields.length === 0) return this.findById(pool, id_funeraria); // Nada que actualizar

    values.push(id_funeraria);

    await pool.query(
      `UPDATE funerarias SET ${fields.join(", ")} WHERE id_funeraria = ?`,
      values
    );

    return this.findById(pool, id_funeraria);
  }

  /** Eliminar funeraria */
  static async delete(pool, id_funeraria) {
    await pool.query(`DELETE FROM funerarias WHERE id_funeraria = ?`, [
      id_funeraria,
    ]);
    return { message: "Funeraria eliminada correctamente" };
  }
}
