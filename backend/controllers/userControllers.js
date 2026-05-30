const userModel = require('../models/usersModels');
const bcrypt = require('bcrypt');

const isValidId = (id) => Number.isInteger(id) && id >= 1;

async function findAllUsers(req, res) {
    try {
        const users = await userModel.findAllUsers();
        return res.status(200).json(users);
    } catch (error) {
        console.error('findAllUsers error: ', error);
        return res.status(500).json({
            message: 'Error listing all users'
        });
    }
}

async function getSuggestions(req, res) {
    try {
        const userId = req.user.userId;
        const suggestions = await userModel.findSuggestions(userId);
        return res.status(200).json(suggestions);
    } catch (error) {
        console.error('getSuggestions error: ', error);
        return res.status(500).json({ message: 'Erro ao buscar sugestões' });
    }
}
async function findUserByID(req, res) {
    try {
        const id = Number(req.params.id);

        if (!isValidId(id)) {
            return res.status(400).json({ message: 'Invalid user ID' });
        }

        const user = await userModel.findUserByID(id);

        if (!user) {
            return res.status(404).json({
                message: 'User not found'
            });
        }

        return res.status(200).json(user);
    } catch (error) {
        console.error('findUserByID error: ', error);
        return res.status(500).json({
            message: 'Error finding user'
        });
    }
}

async function addUser(req, res) {
    try {
        const { FullName, Email, Password, Birthdate } = req.body;

        if (!FullName || !Email || !Password) {
            return res.status(400).json({
                message: 'Missing required fields'
            });
        }

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(Password, saltRounds);

        const newUser = await userModel.addUser(FullName, Email, hashedPassword, Birthdate);

        return res.status(201).json(newUser);

    } catch (error) {
        console.error('addUser error: ', error);
        return res.status(500).json({
            message: 'Error adding user'
        });
    }
}

async function removeUser(req, res) {
    try {
        const id = Number(req.params.id);
        const loggedInUserId = req.user.userId;

        if (!isValidId(id)) {
            return res.status(400).json({ message: 'Invalid user ID' });
        }

        if (id !== loggedInUserId) {
            return res.status(403).json({ message: 'Forbidden: You can only delete your own profile' });
        }

        const affectedRows = userModel.removeUser(id);

        if (affectedRows !== 1) {
            return res.status(404).json({
                message: 'User not found'
            });
        }
        return res.status(200).json({
            message: 'User removed successfully'
        });

    } catch (error) {
        console.error('removeUser error: ', error);
        return res.status(500).json({
            message: 'Error removing user'
        });
    }
}

async function editUser(req, res) {
    try {
        const id = Number(req.params.id);
        const loggedInUserId = req.user.userId;

        if (!isValidId(id)) {
            return res.status(400).json({ message: 'Invalid user ID' });
        }

        if (id !== loggedInUserId) {
            return res.status(403).json({ message: 'Forbidden: You can only edit your own profile' });
        }

        const { FullName, Birthdate, Email, Password, IsPublicProfile } = req.body;
        if (!FullName || !Email) {
            return res.status(400).json({
                message: 'Missing arguments'
            });
        }

        let passwordFinal = Password;
        if (Password) {
            const saltRounds = 10;
            passwordFinal = await bcrypt.hash(Password, saltRounds);
        }

        const affectedRows = userModel.editUser(id, FullName, Birthdate, Email, passwordFinal, IsPublicProfile);

        if (affectedRows === 0) {
            return res.status(404).json({ message: 'User not found or no changes made' });
        }

        return res.status(200).json({ message: 'User updated successfully' });

    } catch (error) {
        console.error('editUser error: ', error);
        return res.status(500).json({ message: 'Error updating user' });
    }
}

module.exports = { findAllUsers, findUserByID, addUser, removeUser, editUser, getSuggestions };