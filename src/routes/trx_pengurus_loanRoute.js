const express = require('express');
const router = express.Router();
const {getPengurusLoansByPengurusNasabahId} = require('../controllers/trx_pengurus_loanController');
const {authMiddleware} = require('../middlewares/authMiddleware');

// GET /pengurus-loans/:id - Mendapatkan pengurus loans berdasarkan ID pengurus nasabah
router.get('/:id', authMiddleware, getPengurusLoansByPengurusNasabahId);

module.exports = router;