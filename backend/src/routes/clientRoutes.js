const express = require('express');
const router = express.Router();
const { salvarCliente, listClients, atualizarCliente } = require('../controllers/clientController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/clientes', salvarCliente);
router.get('/clientes', listClients);
router.put('/clientes/:id', atualizarCliente);

module.exports = router;