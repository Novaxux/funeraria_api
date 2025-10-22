import { Router } from "express";

const router = Router();

router.get("/", (req, res) => {
  res.send("Funeraria API - web root");
});

export default router;
