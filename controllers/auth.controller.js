import * as AuthRepository from '../models/auth.repository.js';

export const login = (tableName, idField) => async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await AuthRepository.login(tableName, email, password, idField);
        if (!user) {
            return res.status(401).json({ message: 'Authentication failed' });
        }
        // Por ahora, solo devolvemos el usuario. Más adelante se agregará JWT.
        res.json({ message: 'Login successful', user });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
