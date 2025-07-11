const db = require('../models');
const trx_kolektabilitas_pengurus = db.trx_kolektabilitas_pengurus;
const logger = require('../utils/logger');

// Get kolektabilitas by pengurus ID dan loan type
// exports.getCountKolektabilitasByPengurusIdAndLoanType = async (pengurusId, loanType) => {
//     try {
//         const kolektabilitas = await trx_kolektabilitas_pengurus.findAll({
//             where: { pengurus_id: pengurusId, loan_type: loanType },
//             attributes: ['status_kolek'],
//         });

//         // Pakai Kol 1 - Kol 5 di map internal
//         const labelMap = {
//             1: 'Kol 1',
//             2: 'Kol 2',
//             3: 'Kol 3',
//             4: 'Kol 4',
//             5: 'Kol 5',
//         };

//         const countMap = {
//             'Kol 1': 0,
//             'Kol 2': 0,
//             'Kol 3': 0,
//             'Kol 4': 0,
//             'Kol 5': 0
//         };

//         // Hitung jumlah masing-masing kolektabilitas
//         for (const item of kolektabilitas) {
//             const kolLabel = labelMap[item.status_kolek];
//             if (kolLabel && countMap.hasOwnProperty(kolLabel)) {
//                 countMap[kolLabel]++;
//             }
//         }

//         // Format buat chart: status_kolek angka, value dari countMap
//         const result = Object.entries(labelMap).map(([num, label]) => ({
//             status_kolek: parseInt(num),
//             total_kolek: countMap[label]
//         }));

//         logger.info(`Fetched count kolektabilitas for pengurus ${pengurusId} and loan type ${loanType}`);
//         return result;
//     } catch (error) {
//         logger.error('Error fetching kolektabilitas by pengurus id and loan type', error);
//         throw new Error('Error fetching kolektabilitas by pengurus id and loan type');
//     }
// }

// Get kolektabilitas by loan id
exports.getKolektabilitasByLoanId = async (loanId) => {
    try {
        const kolektabilitas = await trx_kolektabilitas_pengurus.findAll({
            where: { loan_id: loanId },
            attributes: ['tanggal_kolek','status_kolek'],
        });

        logger.info(`Fetched count kolektabilitas for loan ${loanId}`);
        return kolektabilitas;
    } catch (error) {
        logger.error('Error fetching kolektabilitas by loan id', error);
        throw new Error('Error fetching kolektabilitas by loan id');
    }
}