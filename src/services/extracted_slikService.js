const db = require('../models');
const sequelize = db.sequelize
const trx_company_cash_loan = db.trx_company_cash_loan;
const trx_company_non_cash_loan = db.trx_company_non_cash_loan;
const m_kreditur = db.m_kreditur;
const m_nasabah = db.m_nasabah;
const m_pengurus_nasabah = db.m_pengurus_nasabah;
const rel_mnasabah_mpengurus_nasabah = db.rel_mnasabah_mpengurus_nasabah;
const trx_kolektabilitas = db.trx_kolektabilitas;
const trx_kolektabilitas_pengurus = db.trx_kolektabilitas_pengurus;
const trx_pengurus_loan = db.trx_pengurus_loan;
const logger = require('../utils/logger');
const { Op, where, col } = require('sequelize');

exports.createExtractedSlikData = async (payload) => {
  const nasabahId = payload.nasabahId;
  const extracted = payload.extracted_data;
  const periode = payload.extracted_data[0].data.PERIODE;

  const t = await sequelize.transaction(); // mulai transaksi

  try {
    await m_nasabah.update(
      { periode_terbaru: periode },
      { where: { id: nasabahId }, transaction: t }
    );
    for (const fileData of extracted) {
      const data = fileData.data;

      // === CASH LOAN ===
      for (const loan of data.cash_loan || []) {
        let kreditur = await m_kreditur.findOne({ where: { nama_kreditur: loan.pelapor }, transaction: t });
        if (!kreditur) {
          kreditur = await m_kreditur.create({ nama_kreditur: loan.pelapor }, { transaction: t });
        }

        // 🔧 ambil last id cash_loan
        const lastCashLoan = await trx_company_cash_loan.findOne({
          order: [['id', 'DESC']],
          transaction: t
        });
        const newCashLoanId = lastCashLoan ? lastCashLoan.id + 1 : 1;

        const cashLoan = await trx_company_cash_loan.create({
          id: newCashLoanId, // 🔧 manual set ID
          nasabah_id: nasabahId,
          kreditur_id: kreditur.id,
          plafond: loan.plafon_awal,
          outstanding: loan.outstanding,
          tanggal_mulai: loan.tanggal_mulai,
          tanggal_akhir: loan.tanggal_akhir,
          suku_bunga: loan.bunga,
          jenis_kredit: loan.jenis_kredit,
          kolektabilitas: loan.kualitas,
          periode: periode,
        }, { transaction: t });

        for (const kolek of loan.riwayat_kualitas || []) {
          await trx_kolektabilitas.create({
            nasabah_id: nasabahId,
            loan_id: cashLoan.id,
            loan_type: 'cash_loan',
            tanggal_kolek: kolek.periode,
            status_kolek: kolek.kualitas[0],
            dpd: kolek.kualitas[1],
            periode: periode,
          }, { transaction: t });
        }
      }

      // === NON CASH LOAN ===
      for (const loan of data.non_cash_loan || []) {
        let kreditur = await m_kreditur.findOne({ where: { nama_kreditur: loan.pelapor }, transaction: t });
        if (!kreditur) {
          kreditur = await m_kreditur.create({ nama_kreditur: loan.pelapor }, { transaction: t });
        }

        // 🔧 ambil last id non_cash_loan
        const lastNonCashLoan = await trx_company_non_cash_loan.findOne({
          order: [['id', 'DESC']],
          transaction: t
        });
        const newNonCashLoanId = lastNonCashLoan ? lastNonCashLoan.id + 1 : 1;

        const nonCashLoan = await trx_company_non_cash_loan.create({
          id: newNonCashLoanId, // 🔧 manual set ID
          nasabah_id: nasabahId,
          kreditur_id: kreditur.id,
          plafond: loan.plafon_awal,
          outstanding: loan.outstanding,
          tanggal_mulai: loan.tanggal_mulai,
          tanggal_akhir: loan.tanggal_akhir,
          agunan: loan.jaminan,
          jenis_kredit: loan.jenis_garansi,
          kolektabilitas: loan.kualitas,
          periode: periode,
        }, { transaction: t });

        for (const kolek of loan.riwayat_kualitas || []) {
          await trx_kolektabilitas.create({
            nasabah_id: nasabahId,
            loan_id: nonCashLoan.id,
            loan_type: 'non_cash_loan',
            tanggal_kolek: kolek.periode,
            status_kolek: kolek.kualitas,
            dpd: null,
            periode: periode,
          }, { transaction: t });
        }
      }
    }

    await t.commit(); // commit transaksi kalau semua berhasil
    return { success: true };
  } catch (err) {
    await t.rollback(); // rollback semua kalau ada error
    console.error('Rollback karena error:', err);
    return { success: false, error: err.message };
  }
}

exports.createExtractedSlikPengurusData = async (payload) => {
  const nasabahId = payload.nasabahId;
  const extracted = payload.extracted_data;
  const periode = payload.extracted_data[0].data.PERIODE;

  const t = await sequelize.transaction();

  try {
    for (const fileData of extracted) {
      const data = fileData.data;

      let nama = data.NAMA?.trim() || fileData.filename?.trim();
      if (!nama) continue;

      let nik = data.NIK?.trim() || null;
      let npwp = data.NPWP?.trim() || null;

      // 🔧 PAKAI where + col untuk hindari casing problem
      const whereClause = {
        [Op.or]: [
          // where(col('nama'), nama),
        ]
      };

      // wajib push nama
      whereClause[Op.or].push(where(col('nama'), nama));
      if (nik) whereClause[Op.or].push(where(col('NIK'), nik));
      if (npwp) whereClause[Op.or].push(where(col('NPWP'), npwp));

      let pengurus = await m_pengurus_nasabah.findOne({
        where: whereClause,
        transaction: t
      });

      if (!pengurus) {
        pengurus = await m_pengurus_nasabah.create({
          nama,
          NIK: nik,
          NPWP: npwp
        }, { transaction: t });
      }

      const rel = await rel_mnasabah_mpengurus_nasabah.findOne({
        where: {
          nasabah_id: nasabahId,
          pengurus_nasabah_id: pengurus.id
        },
        transaction: t
      });

      if (!rel) {
        await rel_mnasabah_mpengurus_nasabah.create({
          nasabah_id: nasabahId,
          pengurus_nasabah_id: pengurus.id
        }, { transaction: t });
      }

      for (const loan of data.kredit_aktif || []) {
        let kreditur = await m_kreditur.findOne({ where: { nama_kreditur: loan.pelapor }, transaction: t });
        if (!kreditur) {
          kreditur = await m_kreditur.create({ nama_kreditur: loan.pelapor }, { transaction: t });
        }

        const lastLoan = await db.trx_pengurus_loan.findOne({
          order: [['id', 'DESC']],
          transaction: t
        });
        const newLoanId = lastLoan ? lastLoan.id + 1 : 1;

        const pengurusLoan = await db.trx_pengurus_loan.create({
          id: newLoanId,
          pengurus_nasabah_id: pengurus.id,
          nasabah_id: nasabahId,
          kreditur_id: kreditur.id,
          plafond: loan.plafon_awal,
          outstanding: loan.outstanding,
          tanggal_mulai: loan.tanggal_mulai,
          tanggal_akhir: loan.tanggal_akhir,
          suku_bunga: loan.bunga,
          jenis_kredit: loan.jenis_kredit,
          kolektabilitas: loan.kualitas,
          periode: periode,
        }, { transaction: t });

        for (const kolek of loan.riwayat_kualitas || []) {
          const lastKolek = await trx_kolektabilitas_pengurus.findOne({
            order: [['id', 'DESC']],
            transaction: t
          });
          const newKolekId = lastKolek ? lastKolek.id + 1 : 1;

          await trx_kolektabilitas_pengurus.create({
            id: newKolekId,
            pengurus_nasabah_id: pengurus.id,
            nasabah_id: nasabahId,
            loan_id: pengurusLoan.id,
            // loan_type: 'kredit_aktif',
            tanggal_kolek: kolek.periode,
            status_kolek: kolek.kualitas?.[0],
            dpd: kolek.kualitas?.[1] || null,
            periode: periode,
          }, { transaction: t });
        }
      }
    }

    await t.commit();
    return { success: true };
  } catch (err) {
    await t.rollback();
    console.error('Rollback karena error (pengurus):', err);
    return { success: false, error: err.message };
  }
};
