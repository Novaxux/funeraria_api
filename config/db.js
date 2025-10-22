import mysql from "mysql2/promise";
import { config } from "dotenv";

config();

// =============================================
// CONFIGURACIÓN GENERAL
// =============================================
const DB_HOST = process.env.DB_HOST || "127.0.0.1";
const DB_PORT = Number(process.env.DB_PORT) || 3306;
const DB_NAME = process.env.DB_NAME || "funerarias_db";

// =============================================
// FUNCIÓN GENERADORA DE POOLS
// =============================================
function makePool(user, password) {
	return mysql.createPool({
		host: DB_HOST,
		port: DB_PORT,
		user,
		password,
		database: DB_NAME,
		waitForConnections: true,
		connectionLimit: 10,
		queueLimit: 0,
		namedPlaceholders: true, // opcional: permite usar :param en consultas
	});
}

// =============================================
// POOLS POR ROL / USUARIO
// =============================================
export const adminPool = makePool(
	process.env.DB_ADMIN_USER || "admin_funeraria",
	process.env.DB_ADMIN_PASS || "Admin123!"
);

export const funerariaPool = makePool(
	process.env.DB_FUNERARIA_USER || "funeraria_user",
	process.env.DB_FUNERARIA_PASS || "Funeraria123!"
);

export const empleadoPool = makePool(
	process.env.DB_EMPLEADO_USER || "empleado_user",
	process.env.DB_EMPLEADO_PASS || "Empleado123!"
);

export const clientePool = makePool(
	process.env.DB_CLIENTE_USER || "cliente_user",
	process.env.DB_CLIENTE_PASS || "Cliente123!"
);

// =============================================
// POOL POR DEFECTO (ADMIN)
// =============================================
// Se usa para migraciones, autenticación o endpoints públicos
export const userPool = adminPool;

// =============================================
// OTRAS CONFIGURACIONES DEL SERVIDOR
// =============================================
export const PORT = process.env.PORT || 3000;
export const CORS_ORIGIN = process.env.CORS_ORIGIN || "http://localhost:3000";
export const SESSION_SECRET = process.env.SESSION_SECRET || "keyboard cat";

// =============================================
// PRUEBA OPCIONAL DE CONEXIÓN (puedes comentar)
// =============================================
(async () => {
	try {
		const conn = await adminPool.getConnection();
		console.log("✅ Conexión a la base de datos exitosa:", DB_NAME);
		conn.release();
	} catch (err) {
		console.error("❌ Error al conectar con la base de datos:", err.message);
	}
})();
