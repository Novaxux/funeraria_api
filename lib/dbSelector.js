import { userPool, adminPool } from "../config/db.js";
import { AuthRepository } from "../models/AuthRepository.js";

export async function getPoolFor(req) {
  const userId = req.session.user.id;
  const { role_id } = await AuthRepository.getUserById(userPool, userId);
  console.log("Role ID in getPoolFor:", role_id);
  return Number(role_id) === 1 ? adminPool : userPool;
}