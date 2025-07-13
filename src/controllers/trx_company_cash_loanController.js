const {getCompanyCashLoansByNasabahId} = require('../services/trx_company_cash_loanService');
const logger = require('../utils/logger');
const db = require('../models');
const m_nasabah = db.m_nasabah;

// Mendapatkan company cash loans berdasarkan ID nasabah
// exports.getCompanyCashLoansByNasabahId = async (req, res) => {
//     const { id } = req.params;
//     try {
//         const companyCashLoans = await getCompanyCashLoansByNasabahId(id);
//         if (!companyCashLoans || companyCashLoans.length === 0) {
//             return res.status(404).json({ message: 'Company cash loans not found for this nasabah' });
//         }
//         res.json(companyCashLoans);
//     } catch (error) {
//         logger.error('Error in getCompanyCashLoansByNasabahId controller', error);
//         res.status(500).send('Internal Server Error');
//     }
// };

// Mendapatkan company cash loans berdasarkan ID nasabah
// GET /company-cash-loans/:id?periode=MARET 2025
exports.getCompanyCashLoansByNasabahId = async (req, res) => {
  const { id } = req.params;
  let { periode } = req.query;

  try {
    // kalau gak ada query periode, ambil dari m_nasabah.periode_terbaru
    if (!periode) {
      const nasabah = await m_nasabah.findByPk(id);
      if (!nasabah || !nasabah.periode_terbaru) {
        return res.status(400).json({ message: 'Periode tidak ditemukan untuk nasabah ini' });
      }
      periode = nasabah.periode_terbaru;
    } else {
      periode = periode.replace(/-/g, ' ');
    }

    const companyCashLoans = await getCompanyCashLoansByNasabahId(id, periode);
    if (!companyCashLoans || companyCashLoans.grouped.length === 0) {
      return res.status(404).json({ message: 'Tidak ada data company cash loan untuk periode ini' });
    }

    res.json(companyCashLoans);
  } catch (error) {
    logger.error('Error in getCompanyCashLoansByNasabahId controller', error);
    res.status(500).send('Internal Server Error');
  }
};