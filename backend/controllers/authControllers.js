const userModel = require('../models/usersModels');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const JWT_SECRET_KEY = 'um_dev_sql_entra_num_bar_vai_a_duas_tabelas_e_pergunta_posso_fazer_um_JOIN_200_OK_ELSE_ERROR_404';

const registerUser = async (req, res) => {
    try {
        const { FullName, Email, Password, Birthdate } = req.body;

        if (!FullName || !Email || !Password) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        const existingUser = await userModel.findUserByEmail(Email);
        if (existingUser) {
            return res.status(409).json({ message: 'Email already registered.' });
        }

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(Password, saltRounds);

        const newUser = await userModel.addUser(FullName, Email, hashedPassword, Birthdate);

        delete newUser.Password;

        return res.status(201).json({
            message: 'User registered successfully!',
            user: newUser
        });
    } catch (error) {
        console.error('registerUser error:', error);
        return res.status(500).json({ message: 'Server registerUser error' });
    }
};

const loginUser = async (req, res) => {
    try {
        const { Email, Password } = req.body;

        if (!Email || !Password) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        const existingUser = await userModel.findUserByEmail(Email);

        if (!existingUser) {
            return res.status(404).json({ message: 'Email not registered.' });
        }

        if (Password.length < 8 || Password.length > 20) {
            return res.status(400).json({
                error: 'Password must be between 8 and 20 characters'
            });
        }

        const isPasswordValid = await bcrypt.compare(Password, existingUser.Password);

        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid credentials.' });
        }

        const token = jwt.sign(
            { userId: existingUser.UserID },
            JWT_SECRET_KEY,
            { expiresIn: '24h' }
        );

        return res.status(200).json({
            message: 'Login successful!',
            token: token,
            userId: existingUser.UserID
        });

    } catch (error) {
        console.error('loginUser error:', error);
        return res.status(500).json({ message: 'Server loginUser error' });
    }
};

module.exports = { registerUser, loginUser };