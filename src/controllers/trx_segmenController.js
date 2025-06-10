const {getSegmenByNasabahId} = require('../services/trx_segmenService');
const logger = require('../utils/logger');

// Mendapatkan segmen berdasarkan ID nasabah
exports.getSegmenByNasabahId = async (req, res) => {
    const { id } = req.params;
    try {
        const segmen = await getSegmenByNasabahId(id);
        if (!segmen || segmen.length === 0) {
            return res.status(404).json({ message: 'Segmen not found for this nasabah' });
        }
        res.json(segmen);
    } catch (error) {
        logger.error('Error in getSegmenByNasabahId controller', error);
        res.status(500).send('Internal Server Error');
    }
};