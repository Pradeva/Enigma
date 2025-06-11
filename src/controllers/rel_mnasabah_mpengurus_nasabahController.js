const {getPengurusByNasabahId} = require('../services/rel_mnasabah_mpengurus_nasabahService');
const logger = require('../utils/logger');

// Mendapatkan pengurus nasabah berdasarkan ID nasabah
exports.getPengurusByNasabahId = async (req, res) => {
    const { id } = req.params;
    try {
        const pengurusList = await getPengurusByNasabahId(id);
        if (!pengurusList || pengurusList.length === 0) {
            return res.status(404).json({ message: 'Pengurus nasabah not found for this nasabah' });
        }
        res.json(pengurusList);
    } catch (error) {
        logger.error('Error in getPengurusByNasabahId controller', error);
        res.status(500).send('Internal Server Error');
    }
};