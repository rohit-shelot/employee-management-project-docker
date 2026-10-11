const mongoose = require('mongoose');
const Employee = require('../models/Employee');

// Helper to find employee by MongoDB _id or employeeId
const findEmployeeByIdOrEmpId = async (id) => {
  if (mongoose.Types.ObjectId.isValid(id)) {
    const emp = await Employee.findById(id);
    if (emp) return emp;
  }
  return await Employee.findOne({ employeeId: id.toUpperCase() });
};

// @desc    Get all employees (with optional search and filters)
// @route   GET /api/employees
// @access  Public
const getEmployees = async (req, res, next) => {
  try {
    const { search, department, status } = req.query;
    const filter = {};

    // Search query for fullName, email, employeeId, position
    if (search && search.trim() !== '') {
      const searchRegex = new RegExp(search.trim(), 'i');
      filter.$or = [
        { fullName: searchRegex },
        { email: searchRegex },
        { employeeId: searchRegex },
        { position: searchRegex },
      ];
    }

    // Filter by department
    if (department && department !== 'All' && department.trim() !== '') {
      filter.department = department.trim();
    }

    // Filter by status
    if (status && status !== 'All' && status.trim() !== '') {
      filter.status = status.trim();
    }

    const employees = await Employee.find(filter).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: employees.length,
      data: employees,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single employee by ID
// @route   GET /api/employees/:id
// @access  Public
const getEmployeeById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const employee = await findEmployeeByIdOrEmpId(id);

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: 'Employee not found',
      });
    }

    res.status(200).json({
      success: true,
      data: employee,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new employee
// @route   POST /api/employees
// @access  Public
const createEmployee = async (req, res, next) => {
  try {
    const {
      employeeId,
      fullName,
      email,
      phone,
      department,
      position,
      salary,
      joiningDate,
      status,
    } = req.body;

    // Explicit field validations
    if (!employeeId || !fullName || !email || !phone || !department || !position || !joiningDate) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields: employeeId, fullName, email, phone, department, position, joiningDate.',
      });
    }

    // Check duplicate employee ID
    const existingId = await Employee.findOne({ employeeId: employeeId.trim().toUpperCase() });
    if (existingId) {
      return res.status(400).json({
        success: false,
        message: `An employee with Employee ID '${employeeId.trim().toUpperCase()}' already exists. Employee ID must be unique.`,
      });
    }

    // Check duplicate email
    const existingEmail = await Employee.findOne({ email: email.trim().toLowerCase() });
    if (existingEmail) {
      return res.status(400).json({
        success: false,
        message: `An employee with Email '${email.trim().toLowerCase()}' already exists. Email must be unique.`,
      });
    }

    // Check duplicate phone
    const existingPhone = await Employee.findOne({ phone: phone.trim() });
    if (existingPhone) {
      return res.status(400).json({
        success: false,
        message: `An employee with Phone number '${phone.trim()}' already exists. Phone number must be unique.`,
      });
    }

    const employee = await Employee.create({
      employeeId: employeeId.trim().toUpperCase(),
      fullName: fullName.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      department: department.trim(),
      position: position.trim(),
      salary: Number(salary) || 0,
      joiningDate: new Date(joiningDate),
      status: status || 'Active',
    });

    res.status(201).json({
      success: true,
      message: 'Employee created successfully',
      data: employee,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update employee
// @route   PUT /api/employees/:id
// @access  Public
const updateEmployee = async (req, res, next) => {
  try {
    const { id } = req.params;
    const employee = await findEmployeeByIdOrEmpId(id);

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: 'Employee not found',
      });
    }

    const {
      employeeId,
      fullName,
      email,
      phone,
      department,
      position,
      salary,
      joiningDate,
      status,
    } = req.body;

    // Check unique employeeId if changing
    if (employeeId && employeeId.trim().toUpperCase() !== employee.employeeId) {
      const existingId = await Employee.findOne({
        employeeId: employeeId.trim().toUpperCase(),
        _id: { $ne: employee._id },
      });
      if (existingId) {
        return res.status(400).json({
          success: false,
          message: `Employee ID '${employeeId.trim().toUpperCase()}' is already in use by another employee.`,
        });
      }
      employee.employeeId = employeeId.trim().toUpperCase();
    }

    // Check unique email if changing
    if (email && email.trim().toLowerCase() !== employee.email) {
      const existingEmail = await Employee.findOne({
        email: email.trim().toLowerCase(),
        _id: { $ne: employee._id },
      });
      if (existingEmail) {
        return res.status(400).json({
          success: false,
          message: `Email '${email.trim().toLowerCase()}' is already in use by another employee. Email must be unique.`,
        });
      }
      employee.email = email.trim().toLowerCase();
    }

    // Check unique phone if changing
    if (phone && phone.trim() !== employee.phone) {
      const existingPhone = await Employee.findOne({
        phone: phone.trim(),
        _id: { $ne: employee._id },
      });
      if (existingPhone) {
        return res.status(400).json({
          success: false,
          message: `Phone number '${phone.trim()}' is already in use by another employee. Phone number must be unique.`,
        });
      }
      employee.phone = phone.trim();
    }

    if (fullName !== undefined) employee.fullName = fullName.trim();
    if (department !== undefined) employee.department = department.trim();
    if (position !== undefined) employee.position = position.trim();
    if (salary !== undefined) employee.salary = Number(salary);
    if (joiningDate !== undefined) employee.joiningDate = new Date(joiningDate);
    if (status !== undefined) employee.status = status;

    const updatedEmployee = await employee.save();

    res.status(200).json({
      success: true,
      message: 'Employee updated successfully',
      data: updatedEmployee,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete employee
// @route   DELETE /api/employees/:id
// @access  Public
const deleteEmployee = async (req, res, next) => {
  try {
    const { id } = req.params;
    const employee = await findEmployeeByIdOrEmpId(id);

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: 'Employee not found',
      });
    }

    await Employee.findByIdAndDelete(employee._id);

    res.status(200).json({
      success: true,
      message: 'Employee deleted successfully',
      data: { id: employee._id, employeeId: employee.employeeId },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getEmployees,
  getEmployeeById,
  createEmployee,
  updateEmployee,
  deleteEmployee,
};
