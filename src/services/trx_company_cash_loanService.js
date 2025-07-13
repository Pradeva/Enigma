const db = require('../models');
const trx_company_cash_loan = db.trx_company_cash_loan;
const m_kreditur = db.m_kreditur;
const m_nasabah = db.m_nasabah;
const logger = require('../utils/logger');

// Optional formatter kalau mau format hasil akhirnya ke "12.345.678"
const formatRupiah = (num) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
};

exports.getCompanyCashLoansByNasabahId = async (nasabahId, periodeParam = null) => {
  try {
    // Ambil periode dari query, kalau gak ada ambil dari nasabah.periode_terbaru
    let periode = periodeParam;
    if (!periode) {
      const nasabah = await m_nasabah.findByPk(nasabahId);
      if (!nasabah || !nasabah.periode_terbaru) {
        throw new Error('Periode tidak ditemukan untuk nasabah ini');
      }
      periode = nasabah.periode_terbaru;
    }

    const companyCashLoans = await trx_company_cash_loan.findAll({
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

    for (const loan of companyCashLoans) {
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

      // Clean-up kreditur dari setiap loan (biar gak nested)
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

    // 👉 Hitung grand total dari seluruh kreditur
    const grandPlafond = result.reduce((acc, r) => acc + r.total_plafond, 0);
    const grandOutstanding = result.reduce((acc, r) => acc + r.total_outstanding, 0);

    logger.info(`Fetched company cash loans for nasabah ${nasabahId} dengan periode ${periode}`);

    return {
      periode,
      grouped: result,
      grand_total_plafond: grandPlafond,
      grand_total_outstanding: grandOutstanding,
      grand_total_plafond_formatted: formatRupiah(grandPlafond),
      grand_total_outstanding_formatted: formatRupiah(grandOutstanding)
    };
  } catch (error) {
    logger.error('Error fetching company cash loans by nasabah id', error);
    throw new Error('Error fetching company cash loans by nasabah id');
  }
};

// exports.getCompanyCashLoansByNasabahId = async (nasabahId) => {
//   try {
//     const companyCashLoans = await trx_company_cash_loan.findAll({
//       where: { nasabah_id: nasabahId },
//       include: [
//         {
//           model: m_kreditur,
//           as: 'kreditur',
//           attributes: { exclude: ['createdAt', 'updatedAt'] },
//         },
//       ],
//       attributes: { exclude: ['createdAt', 'updatedAt'] },
//     });

//     const groupedByKreditur = {};

//     for (const loan of companyCashLoans) {
//       const kreditur = loan.kreditur;
//       const krediturId = kreditur.id;

//       const plafond = parseInt(loan.plafond?.replace(/\./g, '')) || 0;
//       const outstanding = parseInt(loan.outstanding?.replace(/\./g, '')) || 0;

//       if (!groupedByKreditur[krediturId]) {
//         groupedByKreditur[krediturId] = {
//           kreditur,
//           loans: [],
//           total_plafond: 0,
//           total_outstanding: 0,
//         };
//       }

//       // Clean-up kreditur dari setiap loan (biar gak nested)
//       loan.dataValues.kreditur = undefined;

//       groupedByKreditur[krediturId].loans.push(loan);
//       groupedByKreditur[krediturId].total_plafond += plafond;
//       groupedByKreditur[krediturId].total_outstanding += outstanding;
//     }

//     const result = Object.values(groupedByKreditur).map(group => ({
//       ...group,
//       total_plafond_formatted: formatRupiah(group.total_plafond),
//       total_outstanding_formatted: formatRupiah(group.total_outstanding),
//     }));

//     // 👉 Hitung grand total dari seluruh kreditur
//     const grandPlafond = result.reduce((acc, r) => acc + r.total_plafond, 0);
//     const grandOutstanding = result.reduce((acc, r) => acc + r.total_outstanding, 0);

//     logger.info(`Fetched company cash loans for nasabah ${nasabahId}`);

//     return {
//       grouped: result,
//       grand_total_plafond: grandPlafond,
//       grand_total_outstanding: grandOutstanding,
//       grand_total_plafond_formatted: formatRupiah(grandPlafond),
//       grand_total_outstanding_formatted: formatRupiah(grandOutstanding)
//     };
//   } catch (error) {
//     logger.error('Error fetching company cash loans by nasabah id', error);
//     throw new Error('Error fetching company cash loans by nasabah id');
//   }
// };