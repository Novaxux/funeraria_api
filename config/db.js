import { config } from "dotenv";
config();

export const PORT = process.env.PORT;
export const CORS_ORIGIN = process.env.CORS_ORIGIN;
export const SESSION_SECRET = process.env.SESSION_SECRET;