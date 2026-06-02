const userModel = require('../models/usersModels');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const registerUser = async (req, res) => {
    try {
        const { FullName, Email, Password, Birthdate } = req.body;

        if (!FullName || !Email || !Password || !Birthdate) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        const birthDate = new Date(Birthdate);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }

        if (age < 18) {
            return res.status(400).json({ message: 'You must be at least 18 years old to register.' });
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
            return res.status(404).json({ message: 'Email or password you entered is incorrect.' });
        }

        if (Password.length < 8 || Password.length > 20) {
            return res.status(400).json({
                error: 'Password must be between 8 and 20 characters'
            });
        }

        const isPasswordValid = await bcrypt.compare(Password, existingUser.Password);

        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Email or password you entered is incorrect.' });
        }

        const token = jwt.sign(
            { userId: existingUser.UserID },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        return res.status(200).json({
            message: 'Login successful!',
            token: token,
            userId: existingUser.UserID,
            fullName: existingUser.FullName
        });

    } catch (error) {
        console.error('loginUser error:', error);
        return res.status(500).json({ message: 'Server loginUser error' });
    }
};

module.exports = { registerUser, loginUser };