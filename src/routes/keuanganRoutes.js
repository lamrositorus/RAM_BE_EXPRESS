const express = require('express');
const router = express.Router();
const keuanganController = require('../controllers/keuanganController');
const authMiddleware = require('../middleware/auth');
const { check } = require('express-validator');

router.use(authMiddleware);

router.post('/', [
  check('deskripsi').notEmpty().withMessage('Description is required'),
  check('nominal').isInt({ min: 1 }).withMessage('Nominal must be positive integer'),
  check('tipe').isIn(['pemasukan', 'pengeluaran']).withMessage('Type must be pemasukan or pengeluaran')
], keuanganController.createKeuangan);

router.get('/', keuanganController.getAllKeuangan);
router.get('/:id', keuanganController.getKeuanganById);

router.put('/:id', [
  check('deskripsi').notEmpty().withMessage('Description is required'),
  check('nominal').isInt({ min: 1 }).withMessage('Nominal must be positive integer'),
  check('tipe').isIn(['pemasukan', 'pengeluaran']).withMessage('Type must be pemasukan or pengeluaran')
], keuanganController.updateKeuangan);

router.delete('/:id', keuanganController.deleteKeuangan);

module.exports = router;