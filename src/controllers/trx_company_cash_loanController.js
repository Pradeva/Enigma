const {getCompanyCashLoansByNasabahId} = require('../services/trx_company_cash_loanService');
const logger = require('../utils/logger');

// Mendapatkan company cash loans berdasarkan ID nasabah
exports.getCompanyCashLoansByNasabahId = async (req, res) => {
    const { id } = req.params;
    try {
        const companyCashLoans = await getCompanyCashLoansByNasabahId(id);
        if (!companyCashLoans || companyCashLoans.length === 0) {
            return res.status(404).json({ message: 'Company cash loans not found for this nasabah' });
        }
        res.json(companyCashLoans);
    } catch (error) {
        logger.error('Error in getCompanyCashLoansByNasabahId controller', error);
        res.status(500).send('Internal Server Error');
    }
};