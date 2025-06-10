const db = require('../models');
const trx_segmen = db.trx_segmen;
const m_nasabah = db.m_nasabah;
const logger = require('../utils/logger');

// Helper buat format nominal ke Rupiah
const formatRupiah = (angka) => {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0
    }).format(angka);
};

exports.getSegmenByNasabahId = async (nasabahId) => {
    try {
        const segmen = await trx_segmen.findAll({
            where: { nasabah_id: nasabahId },
            include: [
                {
                    model: m_nasabah,
                    as: 'nasabah',
                    attributes: { exclude: ['createdAt', 'updatedAt'] },
                },
            ],
            attributes: { exclude: ['createdAt', 'updatedAt'] },
        });
        logger.info(`Fetched segmen for nasabah ${nasabahId}`);

        // Format nominal ke Rupiah
        const formattedSegmen = segmen.map(item => {
            const json = item.toJSON();
            return {
                ...json,
                outstanding: formatRupiah(json.outstanding)
            };
        });
        
        return formattedSegmen;
    } catch (error) {
        logger.error('Error fetching segmen by nasabah id', error);
        throw new Error('Error fetching segmen by nasabah id');
    }
}