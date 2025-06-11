const {
    getKolektabilitasByLoanId
} = require('../services/trx_kolektabilitas_pengurusService');
const logger = require('../utils/logger');

exports.getKolektabilitasByLoanId = async (req, res) => {
    const { loan_id } = req.params;
    try {
        const kolektabilitas = await getKolektabilitasByLoanId(loan_id );
        if (!kolektabilitas || kolektabilitas.length === 0) {
            return res.status(404).json({ message: 'Kolektabilitas not found for this loan' });
        }
        res.json(kolektabilitas);
    } catch (error) {
        logger.error('Error in getKolektabilitasByLoanId controller', error);
        res.status(500).send('Internal Server Error');
    }
};