const db = require('../models');
const m_nasabah = db.m_nasabah;
const logger = require('../utils/logger');

// Mendapatkan semua nasabah
exports.getAllNasabah = async () => {
  try {
    const nasabah = await m_nasabah.findAll();
    logger.info(`Fetched ${nasabah.length} nasabah`);
    return nasabah
  } catch (error) {
    logger.error('Error fetching nasabah', error);
    throw new Error('Error fetching nasabah');
  }
};

//Mendapatkan nasabah menggunakan pagination
exports.getNasabahPagination = async (page = 1, limit = 10) => {
  try {
    const offset = (page - 1) * limit;

    const { rows: nasabah, count: totalItems } = await m_nasabah.findAndCountAll({
      offset,
      limit,
      order: [['createdAt', 'DESC']],
    });

    logger.info(`Fetched ${nasabah.length} nasabah`);
    return {
      data: nasabah,
      pagination: {
        totalItems,
        currentPage: page,
        totalPages: Math.ceil(totalItems / limit),
      },
    };
  } catch (error) {
    logger.error('Error fetching nasabah', error);
    throw new Error('Error fetching nasabah');
  }
};

// Mendapatkan nasabah berdasarkan ID
exports.getNasabahById = async (id) => {
  try {
    const nasabah = await m_nasabah.findByPk(id);
    logger.info(`Fetched nasabah ${id} `);
    return nasabah;
  } catch (error) {
    logger.error('Error fetching nasabah by id', error);
    throw new Error('Error fetching nasabah by id');
  }
};

// Menambahkan nasabah baru
exports.createNasabah = async (nasabahData) => {
  try {
    const newNasabah = await m_nasabah.create(nasabahData);
    logger.info(`Nasabah ${newNasabah.name} created successfully`);
    return newNasabah;
  } catch (error) {
    logger.error('Error creating nasabah', error);
    throw new Error('Error creating nasabah');
  }
};