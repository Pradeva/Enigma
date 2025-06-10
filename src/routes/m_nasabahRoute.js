const express = require('express');
const router = express.Router();
const {getNasabah, getNasabahById, createNasabah, getNasabahPagination} = require('../controllers/m_nasabahController');
const { authMiddleware } = require('../middlewares/authMiddleware');

// GET /nasabah - Mendapatkan semua nasabah
router.get('/', authMiddleware, getNasabah);

// Get /nasabah/page - Mendapatkan nasabah dengan pagination
router.get('/page', authMiddleware, getNasabahPagination);

// GET /nasabah/:id - Mendapatkan nasabah berdasarkan ID
router.get('/:id', authMiddleware, getNasabahById);

// POST /nasabah - Menambahkan nasabah baru
router.post('/', authMiddleware, createNasabah);

module.exports = router;