const express = require('express');
const router = express.Router();
const {getDpkByNasabahId} = require('../controllers/trx_dpkController');
const { authMiddleware } = require('../middlewares/authMiddleware');

// GET /dpk/:id - Mendapatkan dpk berdasarkan ID
router.get('/:id', authMiddleware, getDpkByNasabahId);

module.exports = router;