const Employee = require('../models/Employee');

// @desc    Get dashboard statistics
// @route   GET /api/dashboard/stats
// @access  Public
const getDashboardStats = async (req, res, next) => {
  try {
    const totalEmployees = await Employee.countDocuments();
    const activeEmployees = await Employee.countDocuments({ status: 'Active' });
    const inactiveEmployees = await Employee.countDocuments({ status: 'Inactive' });

    // Distinct departments count
    const departments = await Employee.distinct('department');
    const totalDepartments = departments.length;

    // Also get department breakdown for charts/analytics
    const departmentBreakdown = await Employee.aggregate([
      {
        $group: {
          _id: '$department',
          count: { $sum: 1 },
          active: {
            $sum: {
              $cond: [{ $eq: ['$status', 'Active'] }, 1, 0],
            },
          },
        },
      },
      { $sort: { count: -1 } },
    ]);

    // Format response matching academic requirement exactly:
    // { "totalEmployees": 20, "activeEmployees": 17, "inactiveEmployees": 3, "totalDepartments": 5 }
    res.status(200).json({
      success: true,
      totalEmployees,
      activeEmployees,
      inactiveEmployees,
      totalDepartments,
      departmentBreakdown,
      data: {
        totalEmployees,
        activeEmployees,
        inactiveEmployees,
        totalDepartments,
        departmentBreakdown,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDashboardStats,
};
