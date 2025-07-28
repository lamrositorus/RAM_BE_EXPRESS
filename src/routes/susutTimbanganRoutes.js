const express = require('express');
const router = express.Router();
const susutTimbanganController = require('../controllers/susutTimbanganController');
const authMiddleware = require('../middleware/auth');
const { check } = require('express-validator');

router.use(authMiddleware);

router.post('/', [
  check('tanggal').isISO8601().withMessage('Valid date is required'),
  check('nomor_polisi').notEmpty().withMessage('Nomor polisi is required'),
  check('nama_supir').notEmpty().withMessage('Nama supir is required'),
  check('sp_pabrik').isFloat({ min: 0.01 }).withMessage('SP Pabrik must be positive number'),
  check('buah_pulangan').isFloat({ min: 0 }).withMessage('Buah pulangan must be positive number'),
  check('sp_ram').isFloat({ min: 0.01 }).withMessage('SP RAM must be positive number')
], susutTimbanganController.createSusutTimbangan);

// Simplified GET endpoint without pagination parameters
router.get('/', susutTimbanganController.getAllSusutTimbangan);
router.get('/:id', susutTimbanganController.getSusutTimbanganById);

router.put('/:id', [
  check('tanggal').isISO8601().withMessage('Valid date is required'),
  check('nomor_polisi').notEmpty().withMessage('Nomor polisi is required'),
  check('nama_supir').notEmpty().withMessage('Nama supir is required'),
  check('sp_pabrik').isFloat({ min: 0.01 }).withMessage('SP Pabrik must be positive number'),
  check('buah_pulangan').isFloat({ min: 0 }).withMessage('Buah pulangan must be positive number'),
  check('sp_ram').isFloat({ min: 0.01 }).withMessage('SP RAM must be positive number')
], susutTimbanganController.updateSusutTimbangan);

router.delete('/:id', susutTimbanganController.deleteSusutTimbangan);

module.exports = router;