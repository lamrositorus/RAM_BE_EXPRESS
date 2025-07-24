const express = require('express');
const router = express.Router();
const usersController = require('../controllers/usersController');
const authMiddleware = require('../middleware/auth');
const { check } = require('express-validator');

router.use(authMiddleware);

router.get('/', usersController.getAllUsers);
router.get('/:id', usersController.getUserById);

router.put('/:id', [
  check('username').notEmpty().withMessage('Username is required'),
  check('email').isEmail().withMessage('Valid email is required')
], usersController.updateUser);

router.delete('/:id', usersController.deleteUser);

module.exports = router;