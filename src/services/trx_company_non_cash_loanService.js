const db = require('../models');
const trx_company_non_cash_loan = db.trx_company_non_cash_loan;
const m_kreditur = db.m_kreditur;
const logger = require('../utils/logger');
const m_nasabah = db.m_nasabah;

// Optional formatter kalau mau format hasil akhirnya ke "12.345.678"
const formatRupiah = (num) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
};

exports.getCompanyNonCashLoansByNasabahId = async (nasabahId, periodeParam = null) => {
  try {
    let periode = periodeParam;
    if (!periode) {
      const nasabah = await m_nasabah.findByPk(nasabahId);
      if (!nasabah || !nasabah.periode_terbaru) {
        throw new Error('Periode tidak ditemukan untuk nasabah ini');
      }
      periode = nasabah.periode_terbaru;
    }

    const companyNonCashLoans = await trx_company_non_cash_loan.findAll({
      where: {
        nasabah_id: nasabahId,
        periode: periode
      },
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

    for (const loan of companyNonCashLoans) {
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

    logger.info(`Fetched company non-cash loans for nasabah ${nasabahId} dengan periode ${periode}`);

    return {
      periode,
      grouped: result,
      grand_total_plafond: grandPlafond,
      grand_total_outstanding: grandOutstanding,
      grand_total_plafond_formatted: formatRupiah(grandPlafond),
      grand_total_outstanding_formatted: formatRupiah(grandOutstanding)
    };
  } catch (error) {
    logger.error('Error fetching company non-cash loans by nasabah id', error);
    throw new Error('Error fetching company non-cash loans by nasabah id');
  }
};

// exports.getCompanyNonCashLoansByNasabahId = async (nasabahId) => {
//     try {
//         const companyNonCashLoans = await trx_company_non_cash_loan.findAll({
//             where: { nasabah_id: nasabahId },
//             include: [
//                 {
//                     model: m_kreditur,
//                     as: 'kreditur',
//                     attributes: { exclude: ['createdAt', 'updatedAt'] },
//                 },
//             ],
//             attributes: { exclude: ['createdAt', 'updatedAt'] },
//         });

//         // Grouping by kreditur.id
//         const groupedByKreditur = {};

//         for (const loan of companyNonCashLoans) {
//             const kreditur = loan.kreditur;
//             const krediturId = kreditur.id;

//             // Parse numeric values dari string
//             const plafond = parseInt(loan.plafond?.replace(/\./g, '')) || 0;
//             const outstanding = parseInt(loan.outstanding?.replace(/\./g, '')) || 0;

//             if (!groupedByKreditur[krediturId]) {
//                 groupedByKreditur[krediturId] = {
//                     kreditur,
//                     loans: [],
//                     total_plafond: 0,
//                     total_outstanding: 0,
//                 };
//             }

//             // Remove redundant kreditur from loan
//             loan.dataValues.kreditur = undefined;

//             groupedByKreditur[krediturId].loans.push(loan);
//             groupedByKreditur[krediturId].total_plafond += plafond;
//             groupedByKreditur[krediturId].total_outstanding += outstanding;
//         }

//         // Optionally format total angka jadi string rupiah
//         const result = Object.values(groupedByKreditur).map(group => ({
//             ...group,
//             total_plafond_formatted: formatRupiah(group.total_plafond),
//             total_outstanding_formatted: formatRupiah(group.total_outstanding),
//         }));

//         logger.info(`Fetched company non-cash loans for nasabah ${nasabahId}`);
//         return Object.values(result);
//     } catch (error) {
//         logger.error('Error fetching company non-cash loans by nasabah id', error);
//         throw new Error('Error fetching company non-cash loans by nasabah id');
//     }
// }