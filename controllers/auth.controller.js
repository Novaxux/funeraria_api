import { AuthRepository } from "../models/AuthRepository.js";
import { userPool as pool } from "../config/db.js";
import bcrypt from "bcryptjs";

export async function signup(req, res) {
  const { username, password } = req.body;
  if (!username || !password) {
    return res
      .status(400)
      .json({ error: "username and password are required" });
  }

  try {
    const existing = await AuthRepository.getUserByUsername(pool, username);
    if (existing) {
      return res.status(409).json({ error: "Username already taken" });
    }

    const hashed = await bcrypt.hash(password, 10);
    const userId = await AuthRepository.createUser(pool, {
      username,
      password: hashed,
    });

    // create session
    req.session.user = { id: userId, username };

    res.status(201).json({ message: "User created", userId });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

export async function login(req, res) {
  const { username, password } = req.body;
  if (!username || !password) {
    return res
      .status(400)
      .json({ error: "username and password are required" });
  }

  try {
    const user = await AuthRepository.getUserByUsername(pool, username);
    if (!user) return res.status(401).json({ error: "Invalid credentials" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ error: "Invalid credentials" });

    // Save minimal user info to session
    req.session.user = { id: user.id, username: user.username };

    res.json({ message: "Logged in" });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

export async function logout(req, res) {
  // destroy session
  req.session.destroy((err) => {
    if (err) {
      console.error("Logout error:", err);
      return res.status(500).json({ error: "Could not log out" });
    }
    // clear cookie (express-session default cookie name is connect.sid)
    res.clearCookie("connect.sid");
    res.json({ message: "Logged out" });
  });
}
