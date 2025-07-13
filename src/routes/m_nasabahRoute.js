const express = require('express');
const router = express.Router();
const {
    getNasabah, 
    getNasabahById, 
    createNasabah, 
    getNasabahPagination, 
    getNasabahBySearch, 
    getCountNasabah,
    getWilayah,
    getCountNpl,
    getSegmentasi,
    getTotalOutstanding 
} = require('../controllers/m_nasabahController');
const { authMiddleware } = require('../middlewares/authMiddleware');

// GET /nasabah - Mendapatkan semua nasabah
router.get('/', authMiddleware, getNasabah);

// GET /nasabah/count - Mendapatkan total semua nasabah
router.get('/count', authMiddleware, getCountNasabah);

// GET /nasabah/npl - Mendapatkan total semua npl nasabah
router.get('/npl', authMiddleware, getCountNpl);

// Get /nasabah/page - Mendapatkan nasabah dengan pagination
router.get('/page', authMiddleware, getNasabahPagination);

// GET /nasabah/search - Mendapatkan nasabah berdasarkan NPWP, CIF, atau nama
router.get('/search', authMiddleware, getNasabahBySearch);

// GET /nasabah/wilayah - Mendapatkan wilayah nasabah
router.get('/wilayah', authMiddleware, getWilayah);

// GET /nasabah/segmentasi - Mendapatkan segmentasi nasabah
router.get('/segmentasi', authMiddleware, getSegmentasi);

// GET /nasabah/outstanding - Mendapatkan total outstanding semua nasabah (berdasarkan periode_terbaru)
router.get('/outstanding', authMiddleware, getTotalOutstanding);

// GET /nasabah/:id - Mendapatkan nasabah berdasarkan ID
router.get('/:id', authMiddleware, getNasabahById);

// POST /nasabah - Menambahkan nasabah baru
router.post('/', authMiddleware, createNasabah);



module.exports = router;