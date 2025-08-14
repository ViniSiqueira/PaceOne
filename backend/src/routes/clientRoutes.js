const express = require('express');
const router = express.Router();
const { salvarCliente, listClients, atualizarCliente, getClientesStatusCount } = require('../controllers/clientController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/clientes', salvarCliente);
router.get('/clientes', listClients);
router.put('/clientes/:id', atualizarCliente);
router.get('/clientes/status-count', getClientesStatusCount);

module.exports = router;