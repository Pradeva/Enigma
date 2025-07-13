const db = require('../models');
const trx_pengurus_loan = db.trx_pengurus_loan;
const m_kreditur = db.m_kreditur;
const logger = require('../utils/logger');

// Format ke "12.345.678"
const formatRupiah = (num) => {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
};

exports.getPengurusLoansByPengurusNasabahId = async (pengurusNasabahId, periode = null) => {
  try {
    const whereClause = {
      pengurus_nasabah_id: pengurusNasabahId,
    };

    if (periode) {
      whereClause.periode = periode;
    }

    const pengurusLoans = await trx_pengurus_loan.findAll({
      where: whereClause,
      include: [
        {
          model: m_kreditur,
          as: 'kreditur',
          attributes: { exclude: ['createdAt', 'updatedAt'] },
        },
      ],
      attributes: { exclude: ['createdAt', 'updatedAt'] },
    });

    const groupedByKreditur = {};

    for (const loan of pengurusLoans) {
      const kreditur = loan.kreditur;
      const krediturId = kreditur.id;

      const plafond = parseInt(loan.plafond?.replace(/\./g, '')) || 0;
      const outstanding = parseInt(loan.outstanding?.replace(/\./g, '')) || 0;

      if (!groupedByKreditur[krediturId]) {
        groupedByKreditur[krediturId] = {
          kreditur,
          loans: [],
          total_plafond: 0,
          total_outstanding: 0,
        };
      }

      loan.dataValues.kreditur = undefined;

      groupedByKreditur[krediturId].loans.push(loan);
      groupedByKreditur[krediturId].total_plafond += plafond;
      groupedByKreditur[krediturId].total_outstanding += outstanding;
    }

    const result = Object.values(groupedByKreditur).map(group => ({
      ...group,
      total_plafond_formatted: formatRupiah(group.total_plafond),
      total_outstanding_formatted: formatRupiah(group.total_outstanding),
    }));

    const grandPlafond = result.reduce((acc, r) => acc + r.total_plafond, 0);
    const grandOutstanding = result.reduce((acc, r) => acc + r.total_outstanding, 0);

    logger.info(`Fetched pengurus loans for pengurus_nasabah_id ${pengurusNasabahId}`);

    return {
      grouped: result,
      grand_total_plafond: grandPlafond,
      grand_total_outstanding: grandOutstanding,
      grand_total_plafond_formatted: formatRupiah(grandPlafond),
      grand_total_outstanding_formatted: formatRupiah(grandOutstanding)
    };
  } catch (error) {
    logger.error(`Error fetching pengurus loans for pengurus_nasabah_id ${pengurusNasabahId}:`, error);
    throw error;
  }
};
