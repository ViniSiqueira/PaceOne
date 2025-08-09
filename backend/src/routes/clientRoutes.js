const express = require('express');
const router = express.Router();
const { salvarCliente, listClients } = require('../controllers/clientController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/clientes', salvarCliente);
router.get('/clientes', listClients);

module.exports = router;