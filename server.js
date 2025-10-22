import express from "express";
import cors from "cors";
import morgan from "morgan";
import session from "express-session";

import { PORT, CORS_ORIGIN, SESSION_SECRET } from "./config/config.js";

// Rutas
import webRoutes from "./routes/web.routes.js";
import apiRoutes from "./routes/api.routes.js";

// Middlewares
import { attachUser } from "./middlewares/auth.middleware.js";

const app = express();

app.use(morgan("dev"));
app.use(express.json());
app.use();
app.use(cors({ origin: CORS_ORIGIN, credentials: true }));

// --- Configuración de sesión ---
app.use(
  session({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: false, // cambia a true si usas HTTPS
      sameSite: "lax", // "none" puede causar errores en desarrollo local
      maxAge: 1000 * 60 * 60 * 24, // 1 día
    },
  })
);

// --- Adjunta usuario autenticado a req.user ---
app.use(attachUser);

// --- Rutas ---
app.use("/api", apiRoutes);
app.use("/", webRoutes);

// --- Servidor ---
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
