const {getAllNasabah, getNasabahById, createNasabah, getNasabahPagination, getNasabahByCriteria} = require('../services/m_nasabahService');
const logger = require('../utils/logger');

// Mendapatkan semua nasabah
exports.getNasabah = async (req, res) => {
  try {
    const nasabah = await getAllNasabah();
    res.json(nasabah);
  } catch (error) {
    logger.error('Error in getNasabah controller', error);
    res.status(500).send('Internal Server Error');
  }
};

// Mendapatkan nasabah dengan pagination
exports.getNasabahPagination = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const result = await getNasabahPagination(page, limit);
    res.json(result);
  } catch (error) {
    logger.error('Error in getNasabah controller', error);
    res.status(500).send('Internal Server Error');
  }
};

// Mendapatkan nasabah berdasarkan ID
exports.getNasabahById = async (req, res) => {
  const { id } = req.params;
  try {
    const nasabah = await getNasabahById(id);
    if (!nasabah) {
      return res.status(404).json({ message: 'Nasabah not found' });
    }
    res.json(nasabah);
  } catch (error) {
    logger.error('Error in getNasabahById controller', error);
    res.status(500).send('Internal Server Error');
  }
};

// Menambahkan nasabah baru
exports.createNasabah = async (req, res) => {
  const nasabahData = req.body;
  try {
    const newNasabah = await createNasabah(nasabahData);
    res.status(201).json(newNasabah);
  } catch (error) {
    logger.error('Error in createNasabah controller', error);
    res.status(500).send('Internal Server Error');
  }
};

// Mendapatkan nasabah berdsarkan NPWP, CIF, atau nama
exports.getNasabahBySearch = async (req, res) => {
  const {npwp, cif, nama} = req.query;
  try{
    const result = await getNasabahByCriteria({npwp, cif, nama});
    res.status(200).json(result);
  } catch (error) {
    logger.error('Error in getNasabahBySearch controller', error);
    res.status(500).send('Internal Server Error');
  }
};
