import * as Trabajador from '../models/trabajadores.js';

// Obtener todos los trabajadores
const getAll = async (req, res) => {
  try {
    const trabajadores = await Trabajador.getAllWorkers();
    res.json(trabajadores);
  } catch (error) {
    console.error('Error al obtener los trabajadores:', error);
    res.status(500).json({ message: 'Error al obtener los trabajadores' });
  }
};

// Obtener un trabajador por ID
const getById = async (req, res) => {
  try {
    const { id } = req.params;
    const trabajador = await Trabajador.getWorkerById(id);

    if (!trabajador) {
      return res.status(404).json({ message: 'Trabajador no encontrado' });
    }

    res.json(trabajador);
  } catch (error) {
    console.error('Error al obtener el trabajador:', error);
    res.status(500).json({ message: 'Error al obtener el trabajador' });
  }
};

// Crear un nuevo trabajador
const create = async (req, res) => {
  try {
    const { id_usuario, puesto } = req.body;

    if (!id_usuario || !puesto) {
      return res.status(400).json({ message: 'Faltan campos obligatorios' });
    }

    const nuevoTrabajador = await Trabajador.createWorker({ id_usuario, puesto });
    res.status(201).json(nuevoTrabajador);
  } catch (error) {
    console.error('Error al crear el trabajador:', error);
    res.status(500).json({ message: 'Error al crear el trabajador' });
  }
};

// Actualizar un trabajador
const update = async (req, res) => {
  try {
    const { id } = req.params;
    const { puesto } = req.body;

    const trabajador = await Trabajador.getWorkerById(id);
    if (!trabajador) {
      return res.status(404).json({ message: 'Trabajador no encontrado' });
    }

    const trabajadorActualizado = await Trabajador.updateWorker(id, { puesto });
    res.json(trabajadorActualizado);
  } catch (error) {
    console.error('Error al actualizar el trabajador:', error);
    res.status(500).json({ message: 'Error al actualizar el trabajador' });
  }
};

// Eliminar un trabajador (borrado lógico del usuario asociado)
const remove = async (req, res) => {
  try {
    const { id } = req.params;

    const trabajador = await Trabajador.getWorkerById(id);
    if (!trabajador) {
      return res.status(404).json({ message: 'Trabajador no encontrado' });
    }

    const eliminado = await Trabajador.deleteWorker(trabajador.id_usuario);
    if (!eliminado) {
      return res.status(400).json({ message: 'No se pudo eliminar el trabajador' });
    }

    res.json({ message: 'Trabajador eliminado correctamente (estado_usuario = 0)' });
  } catch (error) {
    console.error('Error al eliminar el trabajador:', error);
    res.status(500).json({ message: 'Error al eliminar el trabajador' });
  }
};

export default {
  getAll,
  getById,
  create,
  update,
  remove,
};
