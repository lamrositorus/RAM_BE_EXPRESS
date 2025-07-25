const dashboardModel = require('../models/dashboardModel');

module.exports = {
  getDashboardData: async (req, res, next) => {
    try {
      const data = await dashboardModel.getDashboardData();
      
      res.json({
        success: true,
        data: {
          ...data,
          total_modal: data.total_pengeluaran, // Hitung modal dari pengeluaran
          total_untung: data.saldo_akhir       // Hitung untung dari saldo akhir
        }
      });
    } catch (err) {
      console.error('Error in dashboardController:', err);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch dashboard data'
      });
    }
  }
};