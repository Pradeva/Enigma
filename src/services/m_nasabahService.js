const db = require('../models');
const m_nasabah = db.m_nasabah;
const logger = require('../utils/logger');
const { Op, literal } = require('sequelize');

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