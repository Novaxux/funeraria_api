import { FunerariasRepository } from "../models/funerariasRepository.js";
import { pool } from "../config/db.js";

export const FunerariasController = {
  /** Listar todas las funerarias */
  async getAll(req, res) {
    try {
      // const data = await FunerariasRepository.findAll(req.pool);
      const data = await FunerariasRepository.findAll(pool);
      res.json(data);
    } catch (err) {
      console.error("getAll funerarias error:", err);
      res.status(500).json({ error: err.message });
    }
  },

  /** Obtener funeraria por ID */
  async getById(req, res) {
    try {
      // const data = await FunerariasRepository.findById(req.pool, req.params.id);
      const data = await FunerariasRepository.findById(pool, req.params.id);
      if (!data)
        return res.status(404).json({ message: "Funeraria no encontrada" });
      res.json(data);
    } catch (err) {
      console.error("getById funeraria error:", err);
      res.status(500).json({ error: err.message });
    }
  },

  /** Crear funeraria (solo admin puede hacerlo) */
  async create(req, res) {
    try {
      const { nombre, direccion, telefono, correo_contacto } = req.body;
      if (!nombre || !direccion || !telefono || !correo_contacto) {
        return res
          .status(400)
          .json({ message: "Todos los campos son obligatorios" });
      }

      // const data = await FunerariasRepository.create(req.pool, {
      const data = await FunerariasRepository.create(pool, {
        nombre,
        direccion,
        telefono,
        correo_contacto,
      });
      res
        .status(201)
        .json({ message: "Funeraria creada correctamente", ...data });
    } catch (err) {
      console.error("create funeraria error:", err);
      res.status(500).json({ error: err.message });
    }
  },

  /** Actualizar funeraria (funeraria o admin) */
  async patch(req, res) {
    try {
      const { id } = req.params;
      // const updated = await FunerariasRepository.update(req.pool, id, req.body);
      const updated = await FunerariasRepository.patch(pool, id, req.body);
      if (!updated)
        return res.status(404).json({ message: "Funeraria no encontrada" });

      res.json({ message: "Funeraria actualizada correctamente", ...updated });
    } catch (err) {
      console.error("update funeraria error:", err);
      res.status(500).json({ error: err.message });
    }
  },

  /** Eliminar funeraria (solo admin) */
  async remove(req, res) {
    try {
      // const data = await FunerariasRepository.delete(req.pool, req.params.id);
      const data = await FunerariasRepository.delete(pool, req.params.id);
      res.json(data);
    } catch (err) {
      console.error("remove funeraria error:", err);
      res.status(500).json({ error: err.message });
    }
  },
};
