const express = require('express');
const router = express.Router();
const {createExtractedSlikDataNasabah, createExtractedSlikDataPengurus} = require('../controllers/extracted_slikController');
const { authMiddleware } = require('../middlewares/authMiddleware');

// POST /perusahaan - Menambahkan hasil slik perusahaan baru
router.post('/perusahaan', authMiddleware, createExtractedSlikDataNasabah);

// POST /pengurus - Menambahkan hasil slik pengurus baru
router.post('/pengurus', authMiddleware, createExtractedSlikDataPengurus);

module.exports = router;