import * as CrudRepository from '../models/crud.repository.js';

const createCrudController = (tableName) => {
    return {
        getAll: async (req, res) => {
            try {
                const items = await CrudRepository.getAll(tableName);
                res.json(items);
            } catch (error) {
                res.status(500).json({ message: error.message });
            }
        },
        getById: async (req, res) => {
            try {
                const item = await CrudRepository.getById(tableName, req.params.id);
                if (!item) {
                    return res.status(404).json({ message: 'Not found' });
                }
                res.json(item);
            } catch (error) {
                res.status(500).json({ message: error.message });
            }
        },
        create: async (req, res) => {
            try {
                const newItem = await CrudRepository.create(tableName, req.body);
                res.status(201).json(newItem);
            } catch (error) {
                res.status(500).json({ message: error.message });
            }
        },
        update: async (req, res) => {
            try {
                const updatedItem = await CrudRepository.update(tableName, req.params.id, req.body);
                res.json(updatedItem);
            } catch (error) {
                res.status(500).json({ message: error.message });
            }
        },
        remove: async (req, res) => {
            try {
                await CrudRepository.remove(tableName, req.params.id);
                res.status(204).json();
            } catch (error) {
                res.status(500).json({ message: error.message });
            }
        },
    };
};

export default createCrudController;
