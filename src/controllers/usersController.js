const usersModel = require('../models/usersModel');
const { validationResult } = require('express-validator');

module.exports = {
  getAllUsers: async (req, res, next) => {
    try {
      const { page = 1, limit = 10 } = req.query;
      const users = await usersModel.getAllUsers(parseInt(page), parseInt(limit));
      res.json(users);
    } catch (err) {
      next(err);
    }
  },

  getUserById: async (req, res, next) => {
    try {
      const user = await usersModel.getUserById(req.params.id);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.json(user);
    } catch (err) {
      next(err);
    }
  },

  updateUser: async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { username, email } = req.body;
      const updatedUser = await usersModel.updateUser(req.params.id, { username, email });
      
      if (!updatedUser) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      res.json(updatedUser);
    } catch (err) {
      next(err);
    }
  },

  deleteUser: async (req, res, next) => {
    try {
      await usersModel.deleteUser(req.params.id);
      res.json({ message: 'User deleted successfully' });
    } catch (err) {
      next(err);
    }
  }
};