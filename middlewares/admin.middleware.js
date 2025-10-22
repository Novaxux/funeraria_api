import { AuthRepository } from "../models/AuthRepository.js";
import { userPool } from "../config/db.js";

export async function requireAdmin(req, res, next) {
  const sessionUser = req.session?.user;
  if (!sessionUser?.id) return res.status(401).json({ error: "Unauthorized" });

  try {
    const user = await AuthRepository.getUserById(userPool, sessionUser.id);
    if (!user) return res.status(401).json({ error: "Unauthorized" });

    // role_id === 1 is considered admin per schema
    if (user.role_id && Number(user.role_id) === 1) {
      req.user = user;
      return next();
    }

    return res.status(403).json({ error: "Forbidden - admin only" });
  } catch (err) {
    console.error("requireAdmin error:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
