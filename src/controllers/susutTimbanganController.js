const susutTimbanganModel = require('../models/susutTimbanganModel');
const { validationResult } = require('express-validator');

module.exports = {
  createSusutTimbangan: async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { tanggal, nomor_polisi, nama_supir, sp_pabrik, buah_pulangan, sp_ram } = req.body;
      const newData = await susutTimbanganModel.createSusutTimbangan({
        tanggal,
        nomor_polisi,
        nama_supir,
        sp_pabrik,
        buah_pulangan,
        sp_ram
      });

      res.status(201).json(newData);
    } catch (err) {
      next(err);
    }
  },

  // Modified to remove pagination
  getAllSusutTimbangan: async (req, res, next) => {
    try {
      const { 
        sortBy = 'tanggal', 
        sortOrder = 'DESC',
        status
      } = req.query;
      
      const data = await susutTimbanganModel.getAllSusutTimbangan(
        sortBy,
        sortOrder,
        status
      );
      
      const stats = await susutTimbanganModel.getSusutStats();
      
      res.json({
        data,
        stats
      });
    } catch (err) {
      next(err);
    }
  },

  getSusutTimbanganById: async (req, res, next) => {
    try {
      const data = await susutTimbanganModel.getSusutTimbanganById(req.params.id);
      if (!data) {
        return res.status(404).json({ message: 'Data not found' });
      }
      res.json(data);
    } catch (err) {
      next(err);
    }
  },

  updateSusutTimbangan: async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { tanggal, nomor_polisi, nama_supir, sp_pabrik, buah_pulangan, sp_ram } = req.body;
      const updatedData = await susutTimbanganModel.updateSusutTimbangan(
        req.params.id,
        { tanggal, nomor_polisi, nama_supir, sp_pabrik, buah_pulangan, sp_ram }
      );
      
      if (!updatedData) {
        return res.status(404).json({ message: 'Data not found' });
      }
      
      res.json(updatedData);
    } catch (err) {
      next(err);
    }
  },

  deleteSusutTimbangan: async (req, res, next) => {
    try {
      await susutTimbanganModel.deleteSusutTimbangan(req.params.id);
      res.json({ message: 'Data deleted successfully' });
    } catch (err) {
      next(err);
    }
  }
};