const express = require('express');
const router = express.Router();
const { getSegmenByNasabahId } = require('../controllers/trx_segmenController');
const { authMiddleware } = require('../middlewares/authMiddleware');

// GET /segmen/:id - Mendapatkan segmen berdasarkan ID nasabah
router.get('/:id', authMiddleware, getSegmenByNasabahId);

module.exports = router;