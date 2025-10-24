import * as Recuerdo from '../models/recuerdos.js';

// Obtener todos los recuerdos (no eliminados)
const getAll = async (req, res) => {
  try {
    const recuerdos = await Recuerdo.getAllRecuerdos();
    res.json(recuerdos);
  } catch (error) {
    console.error('Error al obtener los recuerdos:', error);
    res.status(500).json({ message: 'Error al obtener los recuerdos' });
  }
};

// Obtener un recuerdo por ID
const getById = async (req, res) => {
  try {
    const { id } = req.params;
    const recuerdo = await Recuerdo.getRecuerdoById(id);

    if (!recuerdo) {
      return res.status(404).json({ message: 'Recuerdo no encontrado' });
    }

    res.json(recuerdo);
  } catch (error) {
    console.error('Error al obtener el recuerdo:', error);
    res.status(500).json({ message: 'Error al obtener el recuerdo' });
  }
};

// Crear un nuevo recuerdo
const create = async (req, res) => {
  try {
    const { id_cliente, titulo, texto, entregado = 0, fecha_entrega = null } = req.body;

    if (!id_cliente || !titulo || !texto) {
      return res.status(400).json({ message: 'Faltan campos obligatorios' });
    }

    const nuevoRecuerdo = await Recuerdo.createRecuerdo({
      id_cliente,
      titulo,
      texto,
      entregado,
      fecha_entrega,
    });

    res.status(201).json(nuevoRecuerdo);
  } catch (error) {
    console.error('Error al crear el recuerdo:', error);
    res.status(500).json({ message: 'Error al crear el recuerdo' });
  }
};

// Actualizar un recuerdo existente
const update = async (req, res) => {
  try {
    const { id } = req.params;
    const { titulo, texto, entregado, fecha_entrega } = req.body;

    const recuerdo = await Recuerdo.getRecuerdoById(id);
    if (!recuerdo) {
      return res.status(404).json({ message: 'Recuerdo no encontrado' });
    }

    const recuerdoActualizado = await Recuerdo.updateRecuerdo(id, {
      titulo,
      texto,
      entregado,
      fecha_entrega,
    });

    res.json(recuerdoActualizado);
  } catch (error) {
    console.error('Error al actualizar el recuerdo:', error);
    res.status(500).json({ message: 'Error al actualizar el recuerdo' });
  }
};

// Eliminar (borrado lógico) un recuerdo
const remove = async (req, res) => {
  try {
    const { id } = req.params;

    const recuerdo = await Recuerdo.getRecuerdoById(id);
    if (!recuerdo) {
      return res.status(404).json({ message: 'Recuerdo no encontrado' });
    }

    const eliminado = await Recuerdo.deleteRecuerdo(id);
    if (!eliminado) {
      return res.status(400).json({ message: 'No se pudo eliminar el recuerdo' });
    }

    res.json({ message: 'Recuerdo eliminado correctamente (entregado = -1)' });
  } catch (error) {
    console.error('Error al eliminar el recuerdo:', error);
    res.status(500).json({ message: 'Error al eliminar el recuerdo' });
  }
};

export default {
  getAll,
  getById,
  create,
  update,
  remove,
};
