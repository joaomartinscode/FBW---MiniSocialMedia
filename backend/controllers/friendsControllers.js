const friendsModel = require('../models/friendsModels');

const isValidId = (id) => Number.isInteger(id) && id >= 1;

async function addFriend(req, res) {
    try {
        const userId = req.user.userId;
        const friendId = Number(req.params.friendId);

        if (!isValidId(friendId)) {
            return res.status(400).json({ message: 'ID de amigo inválido' });
        }
        if (userId === friendId) {
            return res.status(400).json({ message: 'Não podes adicionar-te a ti próprio' });
        }

        await friendsModel.addFriend(userId, friendId);
        return res.status(201).json({ message: 'Pedido de amizade enviado' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Erro ao adicionar amigo' });
    }
}

async function acceptFriend(req, res) {
    try {
        const userId = req.user.userId;
        const friendId = Number(req.params.friendId);

        if (!isValidId(friendId)) return res.status(400).json({ message: 'ID de amigo inválido' });

        const affectedRows = await friendsModel.acceptFriend(userId, friendId);
        if (affectedRows < 2) {
            return res.status(404).json({ message: 'Pedido não encontrado ou já aceite' });
        }

        return res.status(200).json({ message: 'Amizade aceite' });
    } catch (error) {
        return res.status(500).json({ message: 'Erro ao aceitar amizade' });
    }
}

async function removeFriend(req, res) {
    try {
        const userId = req.user.userId;
        const friendId = Number(req.params.friendId);

        if (!isValidId(friendId)) return res.status(400).json({ message: 'ID de amigo inválido' });

        const affectedRows = await friendsModel.removeFriend(userId, friendId);
        if (affectedRows < 2) {
            return res.status(404).json({ message: 'Relação não encontrada' });
        }

        return res.status(200).json({ message: 'Amigo removido' });
    } catch (error) {
        return res.status(500).json({ message: 'Erro ao remover amigo' });
    }
}

async function getFriendStatus(req, res) {
    try {
        const userId = req.user.userId;
        const friendId = Number(req.params.friendId);

        if (!isValidId(friendId)) return res.status(400).json({ message: 'ID de amigo inválido' });

        const status = await friendsModel.getFriendStatus(userId, friendId);
        return res.status(200).json({ status });
    } catch (error) {
        return res.status(500).json({ message: 'Erro ao verificar status' });
    }
}

async function findAllFriendsByUserID(req, res) {
    try {
        const userId = req.user.userId;
        const friends = await friendsModel.findAllFriendsByUserID(userId);
        return res.status(200).json(friends);
    } catch (error) {
        return res.status(500).json({ message: 'Erro ao listar amigos' });
    }
}

async function findPendingFriendsByUserID(req, res) {
    try {
        const userId = req.user.userId;
        const pending = await friendsModel.findPendingFriendsByUserID(userId);
        return res.status(200).json(pending);
    } catch (error) {
        return res.status(500).json({ message: 'Erro ao listar pedidos pendentes' });
    }
}

async function findSentRequestsByUserID(req, res) {
    try {
        const userId = req.user.userId;
        const sent = await friendsModel.findSentRequestsByUserID(userId);
        return res.status(200).json(sent);
    } catch (error) {
        return res.status(500).json({ message: 'Erro ao listar pedidos enviados' });
    }
}

module.exports = {
    findAllFriendsByUserID,
    findPendingFriendsByUserID,
    findSentRequestsByUserID,
    acceptFriend,
    removeFriend,
    addFriend,
    getFriendStatus
};