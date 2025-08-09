const express = require('express');
const router = express.Router();
const { salvarCliente } = require('../controllers/clientController');

router.post('/clientes', salvarCliente);

module.exports = router;