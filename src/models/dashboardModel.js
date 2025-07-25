const db = require('../config/database');

module.exports = {
  getDashboardData: async () => {
    try {
      const keuanganQuery = `
        SELECT 
          COALESCE(SUM(CASE WHEN tipe = 'pemasukan' THEN nominal ELSE 0 END), 0) as total_pemasukan,
          COALESCE(SUM(CASE WHEN tipe = 'pengeluaran' THEN nominal ELSE 0 END), 0) as total_pengeluaran,
          COALESCE(SUM(CASE WHEN tipe = 'pemasukan' THEN nominal ELSE -nominal END), 0) as saldo_akhir
        FROM keuangan
      `;

      const susutQuery = `
        SELECT 
          COUNT(*) as total_transaksi,
          COALESCE(SUM(CASE WHEN status = 'susut' THEN 1 ELSE 0 END), 0) as total_susut,
          COALESCE(SUM(CASE WHEN status = 'kelebihan' THEN 1 ELSE 0 END), 0) as total_kelebihan,
          COALESCE(AVG(NULLIF(persentase, 0)), 0) as avg_persentase_susut
        FROM susut_timbangan
      `;

      const [keuanganResult, susutResult] = await Promise.all([
        db.query(keuanganQuery),
        db.query(susutQuery)
      ]);

      return {
        saldo_akhir: keuanganResult.rows[0].saldo_akhir,
        total_pemasukan: keuanganResult.rows[0].total_pemasukan,
        total_pengeluaran: keuanganResult.rows[0].total_pengeluaran,
        statistik_susut: {
          total_transaksi: susutResult.rows[0].total_transaksi,
          total_susut: susutResult.rows[0].total_susut,
          total_kelebihan: susutResult.rows[0].total_kelebihan,
          avg_persentase_susut: Number(susutResult.rows[0].avg_persentase_susut) // Pastikan number
        }
      };
    } catch (err) {
      console.error('Error in dashboardModel:', err);
      throw err;
    }
  }
};