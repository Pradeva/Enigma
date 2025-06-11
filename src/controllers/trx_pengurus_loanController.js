const {getPengurusLoansByPengurusNasabahId} = require('../services/trx_pengurus_loanService');
const logger = require('../utils/logger');

// Mendapatkan pengurus loans berdasarkan ID pengurus nasabah
exports.getPengurusLoansByPengurusNasabahId = async (req, res) => {
    const { id } = req.params;
    try {
        const pengurusLoans = await getPengurusLoansByPengurusNasabahId(id);
        if (!pengurusLoans || pengurusLoans.length === 0) {
            return res.status(404).json({ message: 'Pengurus loans not found for this pengurus nasabah' });
        }
        res.json(pengurusLoans);
    } catch (error) {
        logger.error('Error in getPengurusLoansByPengurusNasabahId controller', error);
        res.status(500).send('Internal Server Error');
    }
};