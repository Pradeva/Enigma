const db = require('../models');
const m_nasabah = db.m_nasabah;
const trx_company_cash_loan = db.trx_company_cash_loan;
const trx_company_non_cash_loan = db.trx_company_non_cash_loan;
const logger = require('../utils/logger');
const { Op, literal, Sequelize } = require('sequelize');

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

// Mendapatkan total semua nasabah
exports.getTotalNasabah = async () => {
  try {
    result = {};
    const totalNasabah = await m_nasabah.count();
    result.totalNasabah = totalNasabah;
    logger.info(`Fetched ${totalNasabah} nasabah`);
    return result
  } catch (error) {
    logger.error('Error fetching nasabah', error);
    throw new Error('Error fetching nasabah');
  }
};

// Mendapatkan total npl semua nasabah
exports.getTotalNPL = async () => {
  const cashNPL = await db.trx_company_cash_loan.count({
    where: {
      kolektabilitas: {
        [Op.ne]: '1 - Lancar'
      }
    }
  });

  const nonCashNPL = await db.trx_company_non_cash_loan.count({
    where: {
      kolektabilitas: {
        [Op.ne]: '1 - Lancar'
      }
    }
  });

  const totalNPL = cashNPL + nonCashNPL;

  return { totalNPL, cashNPL, nonCashNPL };
};

//Mendapatkan nasabah menggunakan pagination
exports.getNasabahPagination = async (page = 1, limit = 10) => {
  try {
    const offset = (page - 1) * limit;

    const { rows: nasabah, count: totalItems } = await m_nasabah.findAndCountAll({
      offset,
      limit,
      order: [['createdAt', 'ASC']],
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

// Mendapatkan wilayah nasabah
exports.getWilayahNasabah = async () => {
  const kota = await m_nasabah.findAll({
    attributes: [
      ['kota', 'nama'],
      [Sequelize.fn('COUNT', Sequelize.col('kota')), 'total']
    ],
    group: ['kota'],
    raw: true
  });

  const provinsi = await m_nasabah.findAll({
    attributes: [
      ['provinsi', 'nama'],
      [Sequelize.fn('COUNT', Sequelize.col('provinsi')), 'total']
    ],
    group: ['provinsi'],
    raw: true
  });

  return { kota, provinsi };
};

// Mendapatkan segmentasi nasabah
exports.getSegmentasiNasabah = async () => {
  const segmentasi = await m_nasabah.findAll({
    attributes: [
      ['segmentasi', 'nama'],
      [Sequelize.fn('COUNT', Sequelize.col('segmentasi')), 'total']
    ],
    group: ['segmentasi'],
    raw: true
  });
  return { segmentasi };
}

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


// ambang batas kemiripan (bisa disesuaikan)
const SIMILARITY_THRESHOLD = 0.3;

exports.getNasabahByCriteria = async ({ npwp, cif, nama }) => {
  try {
    const whereConditions = [];

    if (npwp) {
      whereConditions.push({ NPWP: npwp });
    }

    if (cif) {
      whereConditions.push({ CIF: cif });
    }

    if (nama) {
      whereConditions.push(
        literal(`similarity(lower("nama"), lower('${nama}')) > ${SIMILARITY_THRESHOLD}`)
      );
    }

    const nasabah = await m_nasabah.findAll({
      where: {
        [Op.and]: whereConditions
      },
      order: nama
        ? literal(`similarity(lower("nama"), lower('${nama}')) DESC`)
        : undefined,
      attributes: {
        exclude: ['createdAt', 'updatedAt']
      }
    });

    logger.info(`Fetched nasabah: ${JSON.stringify(nasabah)}`);
    return nasabah;
  } catch (error) {
    logger.error('Error fetching nasabah by criteria', error);
    throw new Error('Error fetching nasabah by criteria');
  }
};




// exports.getNasabahByCriteria = async ({npwp, cif, nama}) => {
//   try {
//     const whereClause = {};

//     if (npwp) {
//       whereClause.NPWP = npwp;
//     }

//     if (cif) {
//       whereClause.CIF = cif;
//     }

//     if (nama) {
//       // whereClause.nama = {
//       //   [Op.like]: `%${nama}%`
//       // };
//       // Pakai fuzzy search via similarity
//       whereClause.push(
//         literal(`similarity(lower("nama"), lower('${nama}')) > ${SIMILARITY_THRESHOLD}`) // Adjust threshold as needed
//       );
//     }

//     const nasabah = await m_nasabah.findAll({
//       // where: whereClause,
//       where: {
//         [Op.and]: whereClause
//       },
//       order: nama
//         ? literal(`similarity(lower("nama"), lower('${nama}')) DESC`)
//         : undefined,
//       attributes: {
//         exclude: ['createdAt', 'updatedAt']
//       }
//     })

//     logger.info(`Fetched nasabah ${nasabah.name}`);
//     return nasabah;
//   } catch (error) {
//     logger.error('Error fetching nasabah by criteria', error);
//     throw new Error('Error fetching nasabah by criteria');
//   }
// }