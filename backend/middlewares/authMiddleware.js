const jwt = require('jsonwebtoken');
const JWT_SECRET = 'um_dev_sql_entra_num_bar_vai_a_duas_tabelas_e_pergunta_posso_fazer_um_JOIN_200_OK_ELSE_ERROR_404';

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Acesso negado. Token não fornecido.' });
    }

    jwt.verify(token, JWT_SECRET, (err, decodedUser) => {
        if (err) {
            return res.status(403).json({ message: 'Token inválido ou expirado.' });
        }

        req.user = decodedUser;

        next();
    });
}

module.exports = authenticateToken;