const express = require('express');
const router = express.Router();
const {
    createSearchHistory,
    getRecentSearchHistoryByUser
} = require('../controllers/m_search_historyController');

const { authMiddleware } = require('../middlewares/authMiddleware');

// POST /history/create - Menambahkan pengguna baru
router.post('/create', createSearchHistory);

// GET /history/recent/:user_id - Mendapatkan 5 search history terbaru berdasarkan user_id
router.get('/recent/:user_id', getRecentSearchHistoryByUser);

module.exports = router;
