const db = require('../models');
const rel_mnasabah_mpengurus_nasabah = db.rel_mnasabah_mpengurus_nasabah;
const logger = require('../utils/logger');

// Mendapatkan semua relasi nasabah dan pengurus nasabah dari input nasabahId
exports.getPengurusByNasabahId = async (nasabahId) => {
    try {
        const pengurusList = await rel_mnasabah_mpengurus_nasabah.findAll({
            where: { nasabah_id: nasabahId },
            include: [
                {
                    model: db.m_pengurus_nasabah,
                    as: 'pengurus_nasabah',
                    attributes: { exclude: ['createdAt', 'updatedAt'] },
                },
            ],
            attributes: { exclude: ['createdAt', 'updatedAt'] },
        });

        logger.info(`Fetched pengurus for nasabah ${nasabahId}`);
        return pengurusList;
    } catch (error) {
        logger.error(`Error fetching pengurus for nasabah ${nasabahId}: ${error.message}`);
        throw error;
    }
};

// Mendapatkan semua relasi nasabah dan pengurus nasabah dari input pengurus id
exports.getNasabahByPengurusId = async (pengurusId) => {
    try {
        const nasabahList = await rel_mnasabah_mpengurus_nasabah.findAll({
            where: { pengurus_nasabah_id: pengurusId },
            include: [
                {
                    model: db.m_nasabah,
                    as: 'nasabah',
                    attributes: { exclude: ['createdAt', 'updatedAt'] },
                },
            ],
            attributes: { exclude: ['createdAt', 'updatedAt'] },
        });

        logger.info(`Fetched nasabah for pengurus ${pengurusId}`);
        return nasabahList;
    } catch (error) {
        logger.error(`Error fetching nasabah for pengurus ${pengurusId}: ${error.message}`);
        throw error;
    }
};