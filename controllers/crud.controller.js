export function makeCrudController(repository) {
  return {
    async list(req, res) {
      try {
        const rows = await repository.list(req.pool);
        res.json(rows);
      } catch (err) {
        console.error("list error:", err);
        res.status(500).json({ error: "Internal Server Error" });
      }
    },

    async get(req, res) {
      try {
        const id = req.params.id;
        const row = await repository.getById(req.pool, id);
        if (!row) return res.status(404).json({ error: "Not found" });
        res.json(row);
      } catch (err) {
        console.error("get error:", err);
        res.status(500).json({ error: "Internal Server Error" });
      }
    },

    async create(req, res) {
      try {
        const data = req.body;
        const insertId = await repository.create(req.pool, data);
        res.status(201).json({ id: insertId });
      } catch (err) {
        console.error("create error:", err);
        res.status(500).json({ error: "Internal Server Error" });
      }
    },

    async update(req, res) {
      try {
        const id = req.params.id;
        const data = req.body;
        const affected = await repository.update(req.pool, id, data);
        if (!affected) return res.status(404).json({ error: "Not found" });
        res.json({ affected });
      } catch (err) {
        console.error("update error:", err);
        res.status(500).json({ error: "Internal Server Error" });
      }
    },

    async remove(req, res) {
      try {
        const id = req.params.id;
        const affected = await repository.delete(req.pool, id);
        if (!affected) return res.status(404).json({ error: "Not found" });
        res.json({ affected });
      } catch (err) {
        console.error("delete error:", err);
        res.status(500).json({ error: "Internal Server Error" });
      }
    },
  };
}
