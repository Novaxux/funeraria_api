import auth from "./auth.routes.js";

import { Router } from "express";

const router = Router();

router.use("/auth", auth);

export default router;