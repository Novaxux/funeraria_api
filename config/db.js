import mysql from "mysql2/promise";
import { config } from "dotenv";

config();

// Create multiple pools for different DB users/roles.
// Environment variables used as fallback; sensible defaults provided for local dev.
const DB_HOST = process.env.DB_HOST || "127.0.0.1";
const DB_PORT = process.env.DB_PORT || 3306;
const DB_NAME = process.env.DB_NAME || "funerarias_db";

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
	});
}

export const adminPool = makePool(process.env.DB_ADMIN_USER || "admin_funeraria", process.env.DB_ADMIN_PASS || "Admin123!");
export const funerariaPool = makePool(process.env.DB_FUNERARIA_USER || "funeraria_user", process.env.DB_FUNERARIA_PASS || "Funeraria123!");
export const empleadoPool = makePool(process.env.DB_EMPLEADO_USER || "empleado_user", process.env.DB_EMPLEADO_PASS || "Empleado123!");
export const clientePool = makePool(process.env.DB_CLIENTE_USER || "cliente_user", process.env.DB_CLIENTE_PASS || "Cliente123!");

// A default pool used by auth logic and public endpoints; prefer adminPool for migrations.
export const userPool = adminPool;

export const PORT = process.env.PORT || 3000;
export const CORS_ORIGIN = process.env.CORS_ORIGIN || "http://localhost:3000";
export const SESSION_SECRET = process.env.SESSION_SECRET || "keyboard cat";