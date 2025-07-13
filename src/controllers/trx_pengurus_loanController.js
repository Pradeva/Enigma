const { getPengurusLoansByPengurusNasabahId } = require('../services/trx_pengurus_loanService');
const logger = require('../utils/logger');

// GET /pengurus-loans/:id?periode=Maret 2025
exports.getPengurusLoansByPengurusNasabahId = async (req, res) => {
  const { id } = req.params;
  const { periode } = req.query;

  try {
    const data = await getPengurusLoansByPengurusNasabahId(id, periode);
    if (!data || !data.grouped || data.grouped.length === 0) {
      return res.status(404).json({ message: 'Data tidak ditemukan' });
    }
    res.json(data);
  } catch (error) {
    logger.error('Error in getPengurusLoansByPengurusNasabahId controller', error);
    res.status(500).send('Internal Server Error');
  }
};
