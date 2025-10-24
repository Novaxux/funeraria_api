import * as RecuerdoFamiliar from '../models/recuerdos_familiares.js';

// Obtener todos los registros de entrega de recuerdos
const getAll = async (req, res) => {
  try {
    const entregas = await RecuerdoFamiliar.getAllRecuerdosFamiliares();
    res.json(entregas);
  } catch (error) {
    console.error('Error al obtener los registros de entrega:', error);
    res.status(500).json({ message: 'Error al obtener los registros de entrega' });
  }
};

// Obtener un registro de entrega por ID
const getById = async (req, res) => {
  try {
    const { id } = req.params;
    const entrega = await RecuerdoFamiliar.getRecuerdoFamiliarById(id);

    if (!entrega) {
      return res.status(404).json({ message: 'Registro de entrega no encontrado' });
    }

    res.json(entrega);
  } catch (error) {
    console.error('Error al obtener el registro de entrega:', error);
    res.status(500).json({ message: 'Error al obtener el registro de entrega' });
  }
};

// Crear un nuevo registro de entrega
const create = async (req, res) => {
  try {
    const { id_recuerdo, id_familiar, metodo_envio = 'Correo', estatus_envio = 'Pendiente' } = req.body;

    if (!id_recuerdo || !id_familiar) {
      return res.status(400).json({ message: 'Faltan campos obligatorios' });
    }

    const nuevaEntrega = await RecuerdoFamiliar.createRecuerdoFamiliar({
      id_recuerdo,
      id_familiar,
      metodo_envio,
      estatus_envio,
    });

    res.status(201).json(nuevaEntrega);
  } catch (error) {
    console.error('Error al crear el registro de entrega:', error);
    res.status(500).json({ message: 'Error al crear el registro de entrega' });
  }
};

// Actualizar un registro de entrega existente
const update = async (req, res) => {
  try {
    const { id } = req.params;
    const { metodo_envio, estatus_envio } = req.body;

    const entrega = await RecuerdoFamiliar.getRecuerdoFamiliarById(id);
    if (!entrega) {
      return res.status(404).json({ message: 'Registro de entrega no encontrado' });
    }

    const entregaActualizada = await RecuerdoFamiliar.updateRecuerdoFamiliar(id, {
      metodo_envio,
      estatus_envio,
    });

    res.json(entregaActualizada);
  } catch (error) {
    console.error('Error al actualizar el registro de entrega:', error);
    res.status(500).json({ message: 'Error al actualizar el registro de entrega' });
  }
};

// Eliminar un registro de entrega (borrado físico)
const remove = async (req, res) => {
  try {
    const { id } = req.params;

    const entrega = await RecuerdoFamiliar.getRecuerdoFamiliarById(id);
    if (!entrega) {
      return res.status(404).json({ message: 'Registro de entrega no encontrado' });
    }

    const eliminado = await RecuerdoFamiliar.deleteRecuerdoFamiliar(id);
    if (!eliminado) {
      return res.status(400).json({ message: 'No se pudo eliminar el registro de entrega' });
    }

    res.json({ message: 'Registro de entrega eliminado correctamente' });
  } catch (error) {
    console.error('Error al eliminar el registro de entrega:', error);
    res.status(500).json({ message: 'Error al eliminar el registro de entrega' });
  }
};

export default {
  getAll,
  getById,
  create,
  update,
  remove,
};
