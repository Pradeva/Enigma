const {getDpkByNasabahId} = require('../services/trx_dpkService');
const logger = require('../utils/logger');

// Mendapatkan dpk berdasarkan ID nasabah
exports.getDpkByNasabahId = async (req, res) => {
    const { id } = req.params;
    try {
        const dpk = await getDpkByNasabahId(id);
        if (!dpk || dpk.length === 0) {
            return res.status(404).json({ message: 'Dpk not found for this nasabah' });
        }
        res.json(dpk);
    } catch (error) {
        logger.error('Error in getDpkByNasabahId controller', error);
        res.status(500).send('Internal Server Error');
    }
};

