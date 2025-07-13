const { getCompanyNonCashLoansByNasabahId } = require('../services/trx_company_non_cash_loanService');
const logger = require('../utils/logger');
const db = require('../models');
const m_nasabah = db.m_nasabah;


// Mendapatkan company non-cash loans berdasarkan ID nasabah
exports.getCompanyNonCashLoansByNasabahId = async (req, res) => {
  const { id } = req.params;
  let { periode } = req.query; // ambil dari query jika ada

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

    // if(periode) {
    //   // Jika periode diberikan, pastikan formatnya benar
    //   periode = periode.replace(/-/g, ' ');
    // }

    const companyNonCashLoans = await getCompanyNonCashLoansByNasabahId(id, periode);
    if (!companyNonCashLoans || companyNonCashLoans.grouped.length === 0) {
      return res.status(404).json({ message: 'Company non-cash loans not found for this nasabah' });
    }
    res.json(companyNonCashLoans);
  } catch (error) {
    logger.error('Error in getCompanyNonCashLoansByNasabahId controller', error);
    res.status(500).send('Internal Server Error');
  }
};
