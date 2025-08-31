const express = require('express');
const { salvarRotina, listRotinas, atualizarRotina, deletarRotina } = require('../controllers/routineController');
const router = express.Router();

router.post('/rotina', salvarRotina);
router.get('/rotina', listRotinas);
router.put('/rotina/:id', atualizarRotina);
router.delete('/rotina/:id', deletarRotina);

module.exports = router;
