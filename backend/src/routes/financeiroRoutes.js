const express = require('express');
const router = express.Router();
const {
    salvarTituloPagar,
    listarTituloPagar,
    atualizarTituloPagar,
    salvarTituloReceber,
    listarTituloReceber,
    atualizarTituloReceber
} = require('../controllers/financeiroController');

// A Pagar
router.post('/financeiro/pagar', salvarTituloPagar);
router.get('/financeiro/pagar', listarTituloPagar);
router.put('/financeiro/pagar/:id', atualizarTituloPagar);

// A Receber
router.post('/financeiro/receber', salvarTituloReceber);
router.get('/financeiro/receber', listarTituloReceber);
router.put('/financeiro/receber/:id', atualizarTituloReceber);

module.exports = router;
