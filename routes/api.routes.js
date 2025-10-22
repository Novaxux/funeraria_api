import auth from "./auth.routes.js";
import resources from "./resources.routes.js";

import { Router } from "express";

const router = Router();

router.use("/auth", auth);
router.use("/", resources);

export default router;