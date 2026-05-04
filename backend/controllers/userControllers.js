const userModel = require('../models/usersModels');

async function findAllUsers(req, res) {
    try{
        const users = await userModel.findAllUsers();

        return res.status(200).json(users);
    }catch (error) {
        console.error('findAllUsers error: ', error);
        return res.status(500).json({
            message: 'Error listing all users'
        });
    }
}

async function findUserByID(req, res){
    try{
        const id = Number(req.params.id);

        if(!Number.isInteger(id) || id < 1){
            return res.status(400).json({ message: 'Invalid user ID'})
        }

        const user = await userModel.findUserByID(id);

        if (!user) {
            return res.status(404).json({
                message: 'User not found'
            })
        }

        return res.status(200).json(user);
    }catch(error){
        console.error('findUserByID error: ', error)
        return res.status(500).json({
           message: 'Error finding user'
        });
    }

}

async function addUser(req, res){
    try{

        const { FullName, Email, Password, Birthdate } = req.body;

        if (!FullName || !Email || !Password) {
            return res.status(400).json({
                message: 'Missing required fields'
            });
        }

        const user = await userModel.addUser(
            FullName, Email, Password, Birthdate
        );

        return res.status(201).json(user);

    }catch(error){
        console.error('addUser error: ', error)
        return res.status(500).json({
            message: 'Error adding user'
        })
    }
}

async function removeUser(req, res){

    try{
        const id = Number(req.params.id);
        if(!Number.isInteger(id) || id < 1){
            return res.status(400).json({ message: 'Invalid user ID'})
        }
        const affectedRows = await userModel.removeUser(id);

        if(affectedRows !== 1){
            return res.status(404).json({
                message: 'User not found'
            })
        }
        return res.status(200).json({
            message: 'User removed successfully'
            });

    }catch(error){
        console.error('removeUser error: ', error)
        return res.status(500).json({
            message: 'Error removing user'
        });
    }

}

async function editUser(req, res) {
    try {
        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id < 1) {
            return res.status(400).json({ message: 'Invalid user ID' });
        }

        const { FullName, Birthdate, Email, Password, IsPublicProfile } = req.body;

        if (!FullName || !Email) {
            return res.status(400).json({
                message: 'Missing arguments'
            });
        }

        const affectedRows = await userModel.editUser(id, FullName, Birthdate, Email, Password, IsPublicProfile);

        if (affectedRows === 0) {
            return res.status(404).json({ message: 'User not found or no changes made' });
        }

        return res.status(200).json({ message: 'User updated successfully' });

    } catch (error) {
        console.error('editUser error: ', error);
        return res.status(500).json({ message: 'Error updating user' });
    }
}

module.exports = {findAllUsers, findUserByID, addUser, removeUser, editUser}

