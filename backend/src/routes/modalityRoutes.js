const express = require('express');
const router = express.Router();
const { salvarModality, listModalitys, atualizarModality } = require('../controllers/modalityController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/modalidade', salvarModality);
router.get('/modalidades', listModalitys);
router.put('/modalidade/:id', atualizarModality);

module.exports = router;
