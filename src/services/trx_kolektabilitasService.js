const db = require('../models');
const trx_kolektabilitas = db.trx_kolektabilitas;
const logger = require('../utils/logger');

// Get kolektabilitas by nasabah ID dan loan type
exports.getCountKolektabilitasByNasabahIdAndLoanType = async (nasabahId, loanType, periode) => {
    try {
        const kolektabilitas = await trx_kolektabilitas.findAll({
            where: { nasabah_id: nasabahId, loan_type: loanType,periode: periode },
            attributes: ['status_kolek'],
        });

        // Pakai Kol 1 - Kol 5 di map internal
        const labelMap = {
            1: 'Kol 1',
            2: 'Kol 2',
            3: 'Kol 3',
            4: 'Kol 4',
            5: 'Kol 5',
        };

        const countMap = {
            'Kol 1': 0,
            'Kol 2': 0,
            'Kol 3': 0,
            'Kol 4': 0,
            'Kol 5': 0
        };

        // Hitung jumlah masing-masing kolektabilitas
        for (const item of kolektabilitas) {
            const kolLabel = labelMap[item.status_kolek];
            if (kolLabel && countMap.hasOwnProperty(kolLabel)) {
                countMap[kolLabel]++;
            }
        }

        // Format buat chart: status_kolek angka, value dari countMap
        const result = Object.entries(labelMap).map(([num, label]) => ({
            status_kolek: parseInt(num),
            total_kolek: countMap[label]
        }));

        logger.info(`Fetched count kolektabilitas for nasabah ${nasabahId} and loan type ${loanType}`);
        return result;
    } catch (error) {
        logger.error('Error fetching kolektabilitas by nasabah id and loan type', error);
        throw new Error('Error fetching kolektabilitas by nasabah id and loan type');
    }
}

//Get kolektabilitas by loan id dan loan type
exports.getKolektabilitasByLoanIdAndLoanType = async (loanId, loanType) => {
    try {
        const kolektabilitas = await trx_kolektabilitas.findAll({
            where: { loan_id: loanId, loan_type: loanType },
            attributes: ['tanggal_kolek','status_kolek','dpd'],
        });

        logger.info(`Fetched count kolektabilitas for loan ${loanId} and loan type ${loanType}`);
        return kolektabilitas;
    } catch (error) {
        logger.error('Error fetching kolektabilitas by loan id and loan type', error);
        throw new Error('Error fetching kolektabilitas by loan id and loan type');
    }
}
