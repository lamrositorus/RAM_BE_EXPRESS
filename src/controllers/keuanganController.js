const keuanganModel = require('../models/keuanganModel');
const { validationResult } = require('express-validator');

module.exports = {
createKeuangan: async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { tanggal, deskripsi, nominal, tipe } = req.body;
    
    // Jika tanggal tidak dikirim dari FE, gunakan waktu sekarang
    const transactionDate = tanggal || new Date().toISOString();

    const newKeuangan = await keuanganModel.createKeuangan({
      tanggal: transactionDate, // akan menggunakan tanggal dari FE atau waktu sekarang
      deskripsi,
      nominal,
      tipe
    });

    res.status(201).json(newKeuangan);
  } catch (err) {
    next(err);
  }
},

  getAllKeuangan: async (req, res, next) => {
    try {
      const { page = 1, limit = 10, tipe } = req.query;
      const keuangan = await keuanganModel.getAllKeuangan(
        parseInt(page),
        parseInt(limit),
        tipe
      );
      
      const total = await keuanganModel.getTotalKeuangan(tipe);
      
      res.json({
        data: keuangan,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: parseInt(total)
        }
      });
    } catch (err) {
      next(err);
    }
  },

  getKeuanganById: async (req, res, next) => {
    try {
      const keuangan = await keuanganModel.getKeuanganById(req.params.id);
      if (!keuangan) {
        return res.status(404).json({ message: 'Data keuangan not found' });
      }
      res.json(keuangan);
    } catch (err) {
      next(err);
    }
  },

  updateKeuangan: async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { tanggal, deskripsi, nominal, tipe } = req.body;
      const updatedKeuangan = await keuanganModel.updateKeuangan(
        req.params.id,
        { tanggal, deskripsi, nominal, tipe }
      );
      
      if (!updatedKeuangan) {
        return res.status(404).json({ message: 'Data keuangan not found' });
      }
      
      res.json(updatedKeuangan);
    } catch (err) {
      next(err);
    }
  },

  deleteKeuangan: async (req, res, next) => {
    try {
      await keuanganModel.deleteKeuangan(req.params.id);
      res.json({ message: 'Data keuangan deleted successfully' });
    } catch (err) {
      next(err);
    }
  }
};