const express = require('express');
const router = express.Router();
const usersController = require('../controllers/userControllers')

const authMiddleware = require('../middlewares/authMiddleware')

router.use(authMiddleware)

router.get('/', usersController.findAllUsers);

router.get('/suggestions', usersController.getSuggestions);

router.get('/:id', usersController.findUserByID);

router.post('/', usersController.addUser);

router.put('/:id', usersController.editUser);

router.delete('/:id', usersController.removeUser);

module.exports = router;