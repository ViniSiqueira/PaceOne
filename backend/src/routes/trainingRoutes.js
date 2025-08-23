const express = require('express');
const { salvarTreino, listTreinos, atualizarTreino } = require('../controllers/trainingController');
const router = express.Router();

router.post('/treinos', salvarTreino);
router.get('/treinos', listTreinos);
router.put('/treinos/:id', atualizarTreino
    
);

module.exports = router;
