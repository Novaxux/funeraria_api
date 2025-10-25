import { AuthRepository } from "../models/AuthRepository.js";
import { userPool } from "../config/db.js";
import { getPoolFor } from "../lib/dbSelector.js";

// Attach authenticated user (if any) to req.user and set req.pool accordingly.
export async function attachUser(req, res, next) {
  try {
    const sessionUser = req.session?.user;
    if (!sessionUser?.id) {
      // No session - attach defaults
      req.user = null;
      req.pool = userPool;
      return next();
    }

    const user = await AuthRepository.getUserById(userPool, sessionUser.id);
    if (!user) {
      req.user = null;
      req.pool = userPool;
      return next();
    }

    req.user = user;
    // Resolve the correct DB pool for this request based on role
    req.pool = await getPoolFor(req);
    return next();
  } catch (err) {
    console.error("attachUser error:", err);
    // Fallbacks
    req.user = null;
    req.pool = userPool;
    return next();
  }
}

// Middleware factory to require a specific role (or roles)
export function requireRole(expectedRoles) {
  // expectedRoles can be number or array of numbers
  const roles = Array.isArray(expectedRoles)
    ? expectedRoles.map(Number)
    : [Number(expectedRoles)];
  return (req, res, next) => {
    const user = req.user;
    if (!user) return res.status(401).json({ error: "Unauthorized" });
    const roleId = Number(user.role_id || -1);
    if (!roles.includes(roleId))
      return res.status(403).json({ error: "Forbidden" });
    return next();
  };
}

// Convenience middlewares
export const requireAdmin = requireRole(1);
export const requireFuneraria = requireRole(2);
export const requireEmpleado = requireRole(3);
export const requireCliente = requireRole(4);
