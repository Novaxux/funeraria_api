import * as Usuario from '../models/usuarios.js';

// Obtener todos los usuarios activos
const getAll = async (req, res) => {
  try {
    const usuarios = await Usuario.getAllUsuarios();
    res.json(usuarios);
  } catch (error) {
    console.error('Error al obtener los usuarios:', error);
    res.status(500).json({ message: 'Error al obtener los usuarios' });
  }
};

// Obtener un usuario por ID
const getById = async (req, res) => {
  try {
    const { id } = req.params;
    const usuario = await Usuario.getUsuarioById(id);

    if (!usuario) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    res.json(usuario);
  } catch (error) {
    console.error('Error al obtener el usuario:', error);
    res.status(500).json({ message: 'Error al obtener el usuario' });
  }
};

// Crear un nuevo usuario
const create = async (req, res) => {
  try {
    const {
      nombre,
      fecha_nacimiento,
      genero,
      rol,
      correo,
      telefono,
      contrasena,
      id_funeraria = null,
    } = req.body;

    if (!nombre || !correo || !contrasena) {
      return res.status(400).json({ message: 'Faltan campos obligatorios' });
    }

    const nuevoUsuario = await Usuario.createUsuario({
      nombre,
      fecha_nacimiento,
      genero,
      rol,
      correo,
      telefono,
      contrasena,
      id_funeraria,
    });

    res.status(201).json(nuevoUsuario);
  } catch (error) {
    console.error('Error al crear el usuario:', error);
    res.status(500).json({ message: 'Error al crear el usuario' });
  }
};

// Actualizar un usuario existente
const update = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      nombre,
      fecha_nacimiento,
      genero,
      rol,
      correo,
      telefono,
      contrasena,
      id_funeraria,
    } = req.body;

    const usuario = await Usuario.getUsuarioById(id);
    if (!usuario) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    const usuarioActualizado = await Usuario.updateUsuario(id, {
      nombre,
      fecha_nacimiento,
      genero,
      rol,
      correo,
      telefono,
      contrasena,
      id_funeraria,
    });

    res.json(usuarioActualizado);
  } catch (error) {
    console.error('Error al actualizar el usuario:', error);
    res.status(500).json({ message: 'Error al actualizar el usuario' });
  }
};

// Eliminar un usuario (borrado lógico)
const remove = async (req, res) => {
  try {
    const { id } = req.params;
    const eliminado = await Usuario.deleteUsuario(id);

    if (!eliminado) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    res.json({ message: 'Usuario eliminado correctamente' });
  } catch (error) {
    console.error('Error al eliminar el usuario:', error);
    res.status(500).json({ message: 'Error al eliminar el usuario' });
  }
};

export default {
  getAll,
  getById,
  create,
  update,
  remove,
};
