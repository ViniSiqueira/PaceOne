const express = require('express');
const { salvarTreino, listTreinos, atualizarTreino, deletarTreino } = require('../controllers/trainingController');
const router = express.Router();

router.post('/treinos', salvarTreino);
router.get('/treinos', listTreinos);
router.put('/treinos/:id', atualizarTreino);
router.delete('/treinos/:id', deletarTreino);

module.exports = router;
