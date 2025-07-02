const {
    createSearchHistory, 
    getRecentSearchHistoryByUser
} = require('../services/m_search_historyService');
const logger = require('../utils/logger');

//Membuat search history
exports.createSearchHistory = async (req, res) => {
  try {
    const searchHistory = await createSearchHistory(req.body);
    res.status(201).json(searchHistory);
  } catch (error) {
    logger.error('Error creating search history:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Mendapatkan 5 search history terbaru berdasarkan user_id
exports.getRecentSearchHistoryByUser = async (req, res) => {
  try {
    const { user_id } = req.params;
    const histories = await getRecentSearchHistoryByUser(user_id);
    res.status(200).json(histories);
  } catch (error) {
    logger.error('Error fetching search history:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
