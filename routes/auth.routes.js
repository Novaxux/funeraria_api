import { Router } from "express";
import * as AuthController from "../controllers/auth.controller.js";

const router = Router();

router.post("/signup", AuthController.signup);
router.post("/login", AuthController.login);
router.post("/logout", AuthController.logout);

export default router;