const db = require('../models');
const m_search_history = db.m_search_history;
const m_nasabah = db.m_nasabah;
const logger = require('../utils/logger');

//Membuat search history
exports.createSearchHistory = async (data) => {
  try {
    const searchHistory = await m_search_history.create(data);
    return searchHistory;
  } catch (error) {
    logger.error('Error creating search history:', error);
    throw error;
  }
};

// Mendapatkan 5 search history terakhir berdasarkan user_id
exports.getRecentSearchHistoryByUser = async (user_id) => {
  try {
    const histories = await m_search_history.findAll({
      where: { user_id },
      limit: 5,
      order: [['created_at', 'DESC']] // atau 'created_at' kalau kamu pakai opsi A sebelumnya
    });
    const nasabahs = [];

    for (const history of histories) {
      const nasabah = await m_nasabah.findByPk(history.nasabah_id);
      if (nasabah) nasabahs.push(nasabah);
    }

    return nasabahs;
  } catch (error) {
    logger.error('Error fetching search history:', error);
    throw error;
  }
};
