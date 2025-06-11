const express = require('express');
const router = express.Router();
const { getPengurusByNasabahId } = require('../controllers/rel_mnasabah_mpengurus_nasabahController');
const { authMiddleware } = require('../middlewares/authMiddleware');

// GET /nasabah-pengurus/pengurus/:id - Mendapatkan pengurus nasabah berdasarkan ID nasabah
router.get('/pengurus/:id', authMiddleware, getPengurusByNasabahId);

module.exports = router;