const {
    getCountKolektabilitasByNasabahIdAndLoanType,
    getKolektabilitasByLoanIdAndLoanType
} = require('../services/trx_kolektabilitasService');
const logger = require('../utils/logger');
const db = require('../models');
const m_nasabah = db.m_nasabah;

// Mendapatkan count kolektabilitas berdasarkan ID nasabah dan jenis pinjaman
exports.getCountKolektabilitasByNasabahIdAndLoanType = async (req, res) => {
    const { nasabahId, loanType } = req.params;
    let { periode } = req.query;
    try {
        if (!periode) {
            const nasabah = await m_nasabah.findByPk(nasabahId);
            if (!nasabah || !nasabah.periode_terbaru) {
                return res.status(400).json({ message: 'Periode tidak ditemukan untuk nasabah ini' });
            }
            periode = nasabah.periode_terbaru;
        }else {
            periode = periode.replace(/-/g, ' ');
        }
        const kolektabilitasCount = await getCountKolektabilitasByNasabahIdAndLoanType(nasabahId, loanType, periode);
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