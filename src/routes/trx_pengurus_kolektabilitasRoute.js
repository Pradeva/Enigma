const express = require('express');
const router = express.Router();
// const { getPengurusByNasabahId } = require('../controllers/rel_mnasabah_mpengurus_nasabahController');
const {getKolektabilitasByLoanId} = require('../controllers/trx_pengurus_kolektabilitasController');
const { authMiddleware } = require('../middlewares/authMiddleware');

// GET /pengurus-kolektabilitas/:id - Mendapatkan kolektabilitas pengurus berdasarkan loan ID nasabah
router.get('/:loan_id', authMiddleware, getKolektabilitasByLoanId);

module.exports = router;