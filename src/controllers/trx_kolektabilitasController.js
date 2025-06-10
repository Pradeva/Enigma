const {
    getCountKolektabilitasByNasabahIdAndLoanType,
    getKolektabilitasByLoanIdAndLoanType
} = require('../services/trx_kolektabilitasService');
const logger = require('../utils/logger');

// Mendapatkan count kolektabilitas berdasarkan ID nasabah dan jenis pinjaman
exports.getCountKolektabilitasByNasabahIdAndLoanType = async (req, res) => {
    const { nasabahId, loanType } = req.params;
    try {
        const kolektabilitasCount = await getCountKolektabilitasByNasabahIdAndLoanType(nasabahId, loanType);
        if (!kolektabilitasCount || kolektabilitasCount.length === 0) {
            return res.status(404).json({ message: 'Kolektabilitas not found for this nasabah and loan type' });
        }
        res.json(kolektabilitasCount);
    } catch (error) {
        logger.error('Error in getCountKolektabilitasByNasabahIdAndLoanType controller', error);
        res.status(500).send('Internal Server Error');
    }
};

// Mendapatkan kolektabilitas berdasarkan ID pinjaman dan jenis pinjaman
exports.getKolektabilitasByLoanIdAndLoanType = async (req, res) => {
    const { loanId, loanType } = req.params;
    try {
        const kolektabilitas = await getKolektabilitasByLoanIdAndLoanType(loanId, loanType);
        if (!kolektabilitas || kolektabilitas.length === 0) {
            return res.status(404).json({ message: 'Kolektabilitas not found for this loan and loan type' });
        }
        res.json(kolektabilitas);
    } catch (error) {
        logger.error('Error in getKolektabilitasByLoanIdAndLoanType controller', error);
        res.status(500).send('Internal Server Error');
    }
};