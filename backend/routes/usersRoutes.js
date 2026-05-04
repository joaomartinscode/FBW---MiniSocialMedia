const express = require('express');
const router = express.Router();
const {findAllUsers, findUserByID, editUser, removeUser, addUser} = require('../controllers/userControllers')

router.get('/', findAllUsers);

router.get('/:id', findUserByID);

router.post('/', addUser);

router.put('/:id', editUser);

router.delete('/:id', removeUser);

module.exports = router;