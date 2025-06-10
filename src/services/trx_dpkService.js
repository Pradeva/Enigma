const db = require('../models');
const trx_dpk = db.trx_dpk;
const ref_jenis_dpk = db.ref_jenis_dpk;
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

exports.getDpkByNasabahId = async (nasabahId) => {
    try {
        const dpk = await trx_dpk.findAll({
            where: { nasabah_id: nasabahId },
            include: [
                {
                    model: ref_jenis_dpk,
                    as: 'jenis_dpk',
                },
                {
                    model: m_nasabah,
                    as: 'nasabah',
                },
            ],
        });
        logger.info(`Fetched dpk for nasabah ${nasabahId}`);

        // Format nominal ke Rupiah
        const formattedDpk = dpk.map(item => {
            const json = item.toJSON();
            return {
                ...json,
                nominal: formatRupiah(json.nominal)
            };
        });
        
        return formattedDpk;
    } catch (error) {
        logger.error('Error fetching dpk by nasabah id', error);
        throw new Error('Error fetching dpk by nasabah id');
    }
}