const express = require('express');
const router = express.Router();

router.get('/', () => { console.log('TESTE DE ROTAS')});

module.exports = router;