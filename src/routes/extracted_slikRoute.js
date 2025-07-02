const express = require('express');
const router = express.Router();
const {createExtractedSlikDataNasabah, createExtractedSlikDataPengurus, createExcelData} = require('../controllers/extracted_slikController');
const { authMiddleware } = require('../middlewares/authMiddleware');

// POST /perusahaan - Menambahkan hasil slik perusahaan baru
router.post('/perusahaan', authMiddleware, createExtractedSlikDataNasabah);

// POST /pengurus - Menambahkan hasil slik pengurus baru
router.post('/pengurus', authMiddleware, createExtractedSlikDataPengurus);

// GET /excel/:id - Mendapatkan data untuk excel
router.get('/excel/:id', createExcelData);

module.exports = router;