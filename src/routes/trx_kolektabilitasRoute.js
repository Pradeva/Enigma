const express = require('express');
const router = express.Router();
const { 
    getCountKolektabilitasByNasabahIdAndLoanType,
    getKolektabilitasByLoanIdAndLoanType 
} = require('../controllers/trx_kolektabilitasController');
const { authMiddleware } = require('../middlewares/authMiddleware');

// GET /kolektabilitas/count/:nasabahId/:loanType - Mendapatkan count kolektabilitas berdasarkan ID nasabah dan jenis pinjaman
router.get('/count/:nasabahId/:loanType', authMiddleware, getCountKolektabilitasByNasabahIdAndLoanType);

// GET /kolektabilitas/:loanId/:loanType - Mendapatkan kolektabilitas berdasarkan ID pinjaman dan jenis pinjaman
router.get('/detail/:loanId/:loanType', authMiddleware, getKolektabilitasByLoanIdAndLoanType);

module.exports = router;