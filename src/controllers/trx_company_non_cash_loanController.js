const {getCompanyNonCashLoansByNasabahId} = require('../services/trx_company_non_cash_loanService');
const logger = require('../utils/logger');

// Mendapatkan company non-cash loans berdasarkan ID nasabah
exports.getCompanyNonCashLoansByNasabahId = async (req, res) => {
    const { id } = req.params;
    try {
        const companyNonCashLoans = await getCompanyNonCashLoansByNasabahId(id);
        if (!companyNonCashLoans || companyNonCashLoans.length === 0) {
            return res.status(404).json({ message: 'Company non-cash loans not found for this nasabah' });
        }
        res.json(companyNonCashLoans);
    } catch (error) {
        logger.error('Error in getCompanyNonCashLoansByNasabahId controller', error);
        res.status(500).send('Internal Server Error');
    }
};