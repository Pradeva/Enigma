const {getPengurusByNasabahId, getNasabahByPengurusId} = require('../services/rel_mnasabah_mpengurus_nasabahService');
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

// Mendapatkan semua relasi nasabah dan pengurus nasabah dari input pengurus id
exports.getNasabahByPengurusId = async (req, res) => {
    const { id } = req.params;
    try {
        const nasabahList = await getNasabahByPengurusId(id);
        if (!nasabahList || nasabahList.length === 0) {
            return res.status(404).json({ message: 'Nasabah not found for this pengurus' });
        }
        res.json(nasabahList);
    } catch (error) {
        logger.error('Error in getNasabahByPengurusId controller', error);
        res.status(500).send('Internal Server Error');
    }
};