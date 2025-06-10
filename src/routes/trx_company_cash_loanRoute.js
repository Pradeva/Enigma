const express = require('express');
const router = express.Router();
const {getCompanyCashLoansByNasabahId} = require('../controllers/trx_company_cash_loanController');
const {authMiddleware} = require('../middlewares/authMiddleware');

// GET /company-cash-loans/:id - Mendapatkan company cash loans berdasarkan ID nasabah
router.get('/:id', authMiddleware, getCompanyCashLoansByNasabahId);

module.exports = router;