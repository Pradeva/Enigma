const { error } = require('winston');
const {createExtractedSlikData, createExtractedSlikPengurusData} = require('../services/extracted_slikService');
const logger = require('../utils/logger');
const ExcelJS = require('exceljs');

const {getNasabahById} = require('../services/m_nasabahService')
const {getCompanyCashLoansByNasabahId} = require('../services/trx_company_cash_loanService');
const {getCompanyNonCashLoansByNasabahId} = require('../services/trx_company_non_cash_loanService');
const {getKolektabilitasByLoanIdAndLoanType} = require('../services/trx_kolektabilitasService')
const {getPengurusByNasabahId} = require('../services/rel_mnasabah_mpengurus_nasabahService');
const {getPengurusLoansByPengurusNasabahId} = require('../services/trx_pengurus_loanService');
const {getKolektabilitasByLoanId} = require('../services/trx_kolektabilitas_pengurusService')

exports.createExcelData = async (req, res) => {
    const { id } = req.params;
    hasil = {}
    try {
        const nasabah = await getNasabahById(id);
        if (!nasabah) {
            return res.status(404).json({ message: 'Nasabah not found' });
        }

        // === CASH LOAN ===
        let cash_loan = await getCompanyCashLoansByNasabahId(id);
        const groupedCashWithKolek = await Promise.all(
        cash_loan.grouped.map(async (group) => {
            const loansWithKolek = await Promise.all(
            group.loans.map(async (loan) => {
                const loanPlain = loan.get ? loan.get({ plain: true }) : loan;
                const kolek = await getKolektabilitasByLoanIdAndLoanType(loanPlain.id, 'cash_loan');
                return {
                ...loanPlain,
                kolektabilitas_detail: kolek
                };
            })
            );

            const groupPlain = group.get ? group.get({ plain: true }) : group;
            return {
            ...groupPlain,
            loans: loansWithKolek
            };
        })
        );

        // === NON-CASH LOAN ===
        let non_cash_loan = await getCompanyNonCashLoansByNasabahId(id);
        const groupedNonCashWithKolek = await Promise.all(
        non_cash_loan.grouped.map(async (group) => {
            const loansWithKolek = await Promise.all(
            group.loans.map(async (loan) => {
                const loanPlain = loan.get ? loan.get({ plain: true }) : loan;
                const kolek = await getKolektabilitasByLoanIdAndLoanType(loanPlain.id, 'non_cash_loan');
                return {
                ...loanPlain,
                kolektabilitas_detail: kolek
                };
            })
            );

            const groupPlain = group.get ? group.get({ plain: true }) : group;
            return {
            ...groupPlain,
            loans: loansWithKolek
            };
        })
        );

        // === PENGURUS & LOANS ===
        const pengurusList = await getPengurusByNasabahId(id);

        const pengurusWithLoans = await Promise.all(
            pengurusList.map(async (pengurus) => {
                const pengurusPlain = pengurus.get ? pengurus.get({ plain: true }) : pengurus;
                const pengurusLoans = await getPengurusLoansByPengurusNasabahId(pengurusPlain.pengurus_nasabah_id);

                const groupedWithKolek = await Promise.all(
                    pengurusLoans.grouped.map(async (group) => {
                        const loansWithKolek = await Promise.all(
                            group.loans.map(async (loan) => {
                                const loanPlain = loan.get ? loan.get({ plain: true }) : loan;
                                const kolek = await getKolektabilitasByLoanId(loanPlain.id);
                                return {
                                    ...loanPlain,
                                    kolektabilitas_detail: kolek ?? []
                                };
                            })
                        );

                        const groupPlain = group.get ? group.get({ plain: true }) : group;
                        return {
                            ...groupPlain,
                            loans: loansWithKolek
                        };
                    })
                );

                return {
                    ...pengurusPlain,
                    loans: {
                        ...pengurusLoans,
                        grouped: groupedWithKolek
                    }
                };
            })
        );
        
        const data = {
            profile: nasabah,
            cash_loan: {
                ...cash_loan,
                grouped: groupedCashWithKolek
            },
            non_cash_loan: {
                ...non_cash_loan,
                grouped: groupedNonCashWithKolek
            },
            pengurus: pengurusWithLoans
        };

        const workbook = new ExcelJS.Workbook();
        const loanSheet = workbook.addWorksheet('Loans');
        const setHeader = (row) => {
        row.font = { bold: true, size: 10, color: { argb: 'FFFFFFFF' } };
        row.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FF003366' },
        };
        row.alignment = { vertical: 'middle', horizontal: 'center' };
        };

        const widths = [5, 35, 20, 20, 20, 20, 20, 15, 20, 30];
        widths.forEach((w, i) => loanSheet.getColumn(i + 1).width = w);

        const addDataRow = (sheet, rowData) => {
        const row = sheet.addRow(rowData);
        row.font = { size: 10 };
        row.eachCell((cell, colNumber) => {
            cell.alignment = {
            horizontal: colNumber === 2 ? 'left' : 'right'
            };
        });
        };

        const header = [
        'No',
        'Nama Kreditur',
        'Plafond',
        'Outstanding',
        'Tanggal Mulai',
        'Tanggal Akhir',
        'Jenis Kredit',
        'Suku Bunga',
        'Kolektabilitas',
        'Detail Kolektabilitas'
        ];

        let sheetCounter = 1;

        // Header debitur
        loanSheet.addRow([`DEBITUR: ${data.profile.nama}`]).font = { bold: true };
        loanSheet.addRow([]); // spasi

        const addLoanSection = (title, groupedLoans, grandPlafond, grandOutstanding) => {
        loanSheet.addRow([title]).font = { bold: true };
        loanSheet.addRow(header);
        setHeader(loanSheet.getRow(loanSheet.lastRow.number));

        let counter = 1;
        groupedLoans.forEach((group) => {
            const kreditur = group.kreditur.nama_kreditur;
            const startRow = loanSheet.lastRow.number + 1;

            group.loans.forEach((loan) => {
            let sheetName = `Kolek-Loan-${sheetCounter++}`;
            if (loan.kolektabilitas_detail && loan.kolektabilitas_detail.length > 0) {
                const kolekSheet = workbook.addWorksheet(sheetName.slice(0, 31));
                kolekSheet.columns = [
                { header: 'Tanggal Kolek', key: 'tanggal_kolek', width: 20 },
                { header: 'Status Kolek', key: 'status_kolek', width: 20 },
                { header: 'DPD', key: 'dpd', width: 10 }
                ];
                setHeader(kolekSheet.getRow(1));

                loan.kolektabilitas_detail.forEach((k) => {
                kolekSheet.addRow({
                    tanggal_kolek: k.tanggal_kolek,
                    status_kolek: k.status_kolek,
                    dpd: k.dpd ?? ''
                });
                });
            } else {
                sheetName = '';
            }

            const hyperlink = sheetName
                ? { text: 'Lihat Detail', hyperlink: `#'${sheetName.slice(0, 31)}'!A1` }
                : '';

            addDataRow(loanSheet, [
                counter++,
                kreditur,
                loan.plafond,
                loan.outstanding,
                loan.tanggal_mulai,
                loan.tanggal_akhir,
                loan.jenis_kredit,
                loan.suku_bunga,
                loan.kolektabilitas,
                hyperlink
            ]);
            });

            // Subtotal per grup
            const totalRow = loanSheet.addRow([
            '',
            'TOTAL',
            group.total_plafond_formatted,
            group.total_outstanding_formatted,
            '', '', '', '', '', ''
            ]);
            totalRow.font = { bold: true };
            totalRow.eachCell((cell, colNumber) => {
            if (colNumber !== 2) cell.alignment = { horizontal: 'right' };
            });

            loanSheet.addRow([]);
        });

        // Grand total
        const grandRow = loanSheet.addRow([
            '',
            'GRAND TOTAL',
            grandPlafond,
            grandOutstanding,
            '', '', '', '', '', ''
        ]);
        grandRow.font = { bold: true };
        grandRow.eachCell((cell, colNumber) => {
            if (colNumber !== 2) cell.alignment = { horizontal: 'right' };
        });

        loanSheet.addRow([]);
        };

        // === Cash Loan
        addLoanSection(
        'CASH LOAN',
        data.cash_loan.grouped,
        data.cash_loan.grand_total_plafond_formatted,
        data.cash_loan.grand_total_outstanding_formatted
        );

        // === Non-Cash Loan
        addLoanSection(
        'NON-CASH LOAN',
        data.non_cash_loan.grouped,
        data.non_cash_loan.grand_total_plafond_formatted,
        data.non_cash_loan.grand_total_outstanding_formatted
        );

        // === Pengurus
        data.pengurus.forEach((pengurus) => {
        loanSheet.addRow([`PENGURUS: ${pengurus.pengurus_nasabah.nama} - ${pengurus.jabatan}`]).font = { bold: true };
        loanSheet.addRow(header);
        setHeader(loanSheet.getRow(loanSheet.lastRow.number));

        let counter = 1;
        pengurus.loans.grouped.forEach((group) => {
            const kreditur = group.kreditur.nama_kreditur;
            group.loans.forEach((loan) => {
            let sheetName = `Kolek-Loan-${sheetCounter++}`;
            if (loan.kolektabilitas_detail && loan.kolektabilitas_detail.length > 0) {
                const kolekSheet = workbook.addWorksheet(sheetName.slice(0, 31));
                kolekSheet.columns = [
                { header: 'Tanggal Kolek', key: 'tanggal_kolek', width: 20 },
                { header: 'Status Kolek', key: 'status_kolek', width: 20 },
                { header: 'DPD', key: 'dpd', width: 10 }
                ];
                setHeader(kolekSheet.getRow(1));

                loan.kolektabilitas_detail.forEach((k) => {
                kolekSheet.addRow({
                    tanggal_kolek: k.tanggal_kolek,
                    status_kolek: k.status_kolek,
                    dpd: k.dpd ?? ''
                });
                });
            } else {
                sheetName = '';
            }

            const hyperlink = sheetName
                ? { text: 'Lihat Detail', hyperlink: `#'${sheetName.slice(0, 31)}'!A1` }
                : '';

            addDataRow(loanSheet, [
                counter++,
                kreditur,
                loan.plafond,
                loan.outstanding,
                loan.tanggal_mulai,
                loan.tanggal_akhir,
                loan.jenis_kredit,
                loan.suku_bunga,
                loan.kolektabilitas,
                hyperlink
            ]);
            });

            const totalRow = loanSheet.addRow([
            '',
            'TOTAL',
            group.total_plafond_formatted,
            group.total_outstanding_formatted,
            '', '', '', '', '', ''
            ]);
            totalRow.font = { bold: true };
            totalRow.eachCell((cell, colNumber) => {
            if (colNumber !== 2) cell.alignment = { horizontal: 'right' };
            });

            loanSheet.addRow([]);
        });

        const grandRow = loanSheet.addRow([
            '',
            'GRAND TOTAL',
            pengurus.loans.grand_total_plafond_formatted,
            pengurus.loans.grand_total_outstanding_formatted,
            '', '', '', '', '', ''
        ]);
        grandRow.font = { bold: true };
        grandRow.eachCell((cell, colNumber) => {
            if (colNumber !== 2) cell.alignment = { horizontal: 'right' };
        });

        loanSheet.addRow([]);
        });

        // Format nama file
        const sanitize = (text) => text.replace(/[\\/:*?"<>|]/g, '').replace(/\s+/g, '_');
        const filename = sanitize(data.profile.nama) + '_loans.xlsx';

        // Generate buffer Excel
        const buffer = await workbook.xlsx.writeBuffer();

        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
        res.send(buffer);

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

exports.createExtractedSlikDataNasabah = async (req, res) => {
    const data = req.body;
    try {
        const hasilSlik = await createExtractedSlikData(data);
        if(hasilSlik["success"] == false) {
            throw new error(hasilSlik["error"]);
        }
        res.status(201).json(hasilSlik);
    } catch (error) {
        logger.error('Error in createNasabah controller', error);
        res.status(500).send("internal server error");
    }
}

exports.createExtractedSlikDataPengurus = async (req, res) => {
    const data = req.body;
    try {
        const hasilSlik = await createExtractedSlikPengurusData(data);
        if(hasilSlik["success"] == false) {
            throw new error(hasilSlik["error"]);
        }
        res.status(201).json(hasilSlik);
    } catch (error) {
        logger.error('Error in createNasabah controller', error);
        res.status(500).send("internal server error");
    }
}