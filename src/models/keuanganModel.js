const db = require('../config/database');

module.exports = {
createKeuangan: async ({ tanggal, deskripsi, nominal, tipe }) => {
  const result = await db.query(
    `INSERT INTO keuangan (tanggal, deskripsi, nominal, tipe) 
     VALUES ($1, $2, $3, $4) 
     RETURNING *`,
    [tanggal, deskripsi, nominal, tipe]
  );
  return result.rows[0];
},
  getKeuanganById: async (id) => {
    const result = await db.query('SELECT * FROM keuangan WHERE id = $1', [id]);
    return result.rows[0];
  },

  updateKeuangan: async (id, { tanggal, deskripsi, nominal, tipe }) => {
    const result = await db.query(
      'UPDATE keuangan SET tanggal = $1, deskripsi = $2, nominal = $3, tipe = $4 WHERE id = $5 RETURNING *',
      [tanggal, deskripsi, nominal, tipe, id]
    );
    return result.rows[0];
  },

  deleteKeuangan: async (id) => {
    await db.query('DELETE FROM keuangan WHERE id = $1', [id]);
  },

  getAllKeuangan: async (page = 1, limit = 10, tipe = null) => {
    const offset = (page - 1) * limit;
    let query = 'SELECT * FROM keuangan';
    let params = [limit, offset];
    
    if (tipe) {
      query += ' WHERE tipe = $3 ORDER BY tanggal DESC LIMIT $1 OFFSET $2';
      params.push(tipe);
    } else {
      query += ' ORDER BY tanggal DESC LIMIT $1 OFFSET $2';
    }
    
    const result = await db.query(query, params);
    return result.rows;
  },

  getTotalKeuangan: async (tipe = null) => {
    let query = 'SELECT SUM(nominal) as total FROM keuangan';
    let params = [];
    
    if (tipe) {
      query += ' WHERE tipe = $1';
      params.push(tipe);
    }
    
    const result = await db.query(query, params);
    return result.rows[0].total || 0;
  }
};