const express = require('express');
const router = express.Router();
const { salvarCliente, listClients, atualizarCliente, getClientesStatusCount, deletarCliente } = require('../controllers/clientController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/clientes', salvarCliente);
router.get('/clientes', listClients);
router.put('/clientes/:id', atualizarCliente);
router.get('/clientes/status-count', getClientesStatusCount);
router.delete('/clientes/:id', deletarCliente);

module.exports = router;