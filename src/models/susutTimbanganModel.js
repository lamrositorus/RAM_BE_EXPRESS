const db = require('../config/database');

module.exports = {
  createSusutTimbangan: async ({ tanggal, nomor_polisi, nama_supir, sp_pabrik, buah_pulangan, sp_ram }) => {
    const result = await db.query(
      `INSERT INTO susut_timbangan 
      (tanggal, nomor_polisi, nama_supir, sp_pabrik, buah_pulangan, sp_ram) 
      VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [tanggal, nomor_polisi, nama_supir, sp_pabrik, buah_pulangan, sp_ram]
    );
    return result.rows[0];
  },

  getSusutTimbanganById: async (id) => {
    const result = await db.query('SELECT * FROM susut_timbangan WHERE id = $1', [id]);
    return result.rows[0];
  },

  updateSusutTimbangan: async (id, { tanggal, nomor_polisi, nama_supir, sp_pabrik, buah_pulangan, sp_ram }) => {
    const result = await db.query(
      `UPDATE susut_timbangan SET 
      tanggal = $1, nomor_polisi = $2, nama_supir = $3, 
      sp_pabrik = $4, buah_pulangan = $5, sp_ram = $6 
      WHERE id = $7 RETURNING *`,
      [tanggal, nomor_polisi, nama_supir, sp_pabrik, buah_pulangan, sp_ram, id]
    );
    return result.rows[0];
  },

  deleteSusutTimbangan: async (id) => {
    await db.query('DELETE FROM susut_timbangan WHERE id = $1', [id]);
  },

  // Modified to remove pagination
  getAllSusutTimbangan: async (sortBy = 'tanggal', sortOrder = 'DESC', status = null) => {
    let query = 'SELECT * FROM susut_timbangan';
    const params = [];
    
    if (status) {
      query += ' WHERE status = $1';
      params.push(status);
    }
    
    query += ` ORDER BY ${sortBy} ${sortOrder}`;
    
    const result = await db.query(query, params);
    return result.rows;
  },

  getSusutStats: async () => {
    const result = await db.query(`
      SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN status = 'susut' THEN 1 ELSE 0 END) as total_susut,
        SUM(CASE WHEN status = 'kelebihan' THEN 1 ELSE 0 END) as total_kelebihan,
        SUM(CASE WHEN status = 'normal' THEN 1 ELSE 0 END) as total_normal
      FROM susut_timbangan
    `);
    return result.rows[0];
  }
};