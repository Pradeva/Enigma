const express = require('express');
const router = express.Router();
const { getCompanyNonCashLoansByNasabahId } = require('../controllers/trx_company_non_cash_loanController');
const { authMiddleware } = require('../middlewares/authMiddleware');

// GET /company-non-cash-loans/:id - Mendapatkan company non-cash loans berdasarkan ID nasabah
router.get('/:id', authMiddleware, getCompanyNonCashLoansByNasabahId);

module.exports = router;