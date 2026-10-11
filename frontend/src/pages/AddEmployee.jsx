import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { createEmployee } from '../services/api';

const DEPARTMENTS = [
  'Engineering',
  'Human Resources',
  'Operations',
  'Design',
  'Marketing',
  'Finance',
  'Sales',
  'Customer Support',
  'Legal',
];

export default function AddEmployee() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    employeeId: '',
    fullName: '',
    email: '',
    phone: '',
    department: '',
    position: '',
    salary: '',
    joiningDate: new Date().toISOString().split('T')[0],
    status: 'Active',
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const validate = () => {
    const newErrors = {};

    if (!formData.employeeId.trim()) {
      newErrors.employeeId = 'Employee ID is required';
    } else if (formData.employeeId.trim().length < 2) {
      newErrors.employeeId = 'Employee ID must be at least 2 characters';
    }

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = 'Please provide a valid email address';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (formData.phone.trim().length < 7) {
      newErrors.phone = 'Please provide a valid phone number';
    }

    if (!formData.department.trim()) {
      newErrors.department = 'Please select a department';
    }

    if (!formData.position.trim()) {
      newErrors.position = 'Position/Designation is required';
    }

    if (formData.salary === '' || formData.salary === null) {
      newErrors.salary = 'Salary is required';
    } else if (Number(formData.salary) < 0) {
      newErrors.salary = 'Salary cannot be negative';
    }

    if (!formData.joiningDate) {
      newErrors.joiningDate = 'Joining date is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear validation error when user types
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) {
      toast.warn('Please fix the form errors before submitting.', { toastId: 'form-validation' });
      return;
    }

    try {
      setSubmitting(true);
      await createEmployee({
        ...formData,
        employeeId: formData.employeeId.trim().toUpperCase(),
        salary: Number(formData.salary),
      });

      toast.success(`Employee "${formData.fullName}" created successfully!`);
      navigate('/employees');
    } catch (err) {
      toast.error(err.message || 'Failed to create employee record');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Add New Employee</h1>
          <p className="page-subtitle">Fill in the employee details to register a new staff member</p>
        </div>
        <Link to="/employees" className="btn-secondary">
          &larr; Back to Employees
        </Link>
      </div>

      <div className="card" style={{ maxWidth: '800px' }}>
        <div className="card-header">
          <h3 className="card-title">Employee Information</h3>
          <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
            * Indicates required field
          </span>
        </div>

        <div className="card-body">
          <form onSubmit={handleSubmit} noValidate>
            <div className="form-grid">
              {/* Employee ID */}
              <div className="form-group">
                <label className="form-label">
                  Employee ID <span className="required">*</span>
                  <span style={{ fontSize: '0.75rem', color: '#6366f1', fontWeight: 600, marginLeft: '6px' }}>(Primary &amp; Unique)</span>
                </label>
                <input
                  type="text"
                  name="employeeId"
                  className={`form-control ${errors.employeeId ? 'error' : ''}`}
                  placeholder="e.g. EMP106"
                  value={formData.employeeId}
                  onChange={handleChange}
                />
                {errors.employeeId && (
                  <span className="error-message">{errors.employeeId}</span>
                )}
              </div>

              {/* Full Name */}
              <div className="form-group">
                <label className="form-label">
                  Full Name <span className="required">*</span>
                </label>
                <input
                  type="text"
                  name="fullName"
                  className={`form-control ${errors.fullName ? 'error' : ''}`}
                  placeholder="e.g. John Doe"
                  value={formData.fullName}
                  onChange={handleChange}
                />
                {errors.fullName && (
                  <span className="error-message">{errors.fullName}</span>
                )}
              </div>

              {/* Email */}
              <div className="form-group">
                <label className="form-label">
                  Email Address <span className="required">*</span>
                  <span style={{ fontSize: '0.75rem', color: '#6366f1', fontWeight: 600, marginLeft: '6px' }}>(Unique)</span>
                </label>
                <input
                  type="email"
                  name="email"
                  className={`form-control ${errors.email ? 'error' : ''}`}
                  placeholder="e.g. john.doe@example.com"
                  value={formData.email}
                  onChange={handleChange}
                />
                {errors.email && (
                  <span className="error-message">{errors.email}</span>
                )}
              </div>

              {/* Phone */}
              <div className="form-group">
                <label className="form-label">
                  Phone Number <span className="required">*</span>
                  <span style={{ fontSize: '0.75rem', color: '#6366f1', fontWeight: 600, marginLeft: '6px' }}>(Unique)</span>
                </label>
                <input
                  type="text"
                  name="phone"
                  className={`form-control ${errors.phone ? 'error' : ''}`}
                  placeholder="e.g. +1 (555) 019-2834"
                  value={formData.phone}
                  onChange={handleChange}
                />
                {errors.phone && (
                  <span className="error-message">{errors.phone}</span>
                )}
              </div>

              {/* Department */}
              <div className="form-group">
                <label className="form-label">
                  Department <span className="required">*</span>
                </label>
                <select
                  name="department"
                  className={`form-control ${errors.department ? 'error' : ''}`}
                  value={formData.department}
                  onChange={handleChange}
                >
                  <option value="">-- Select Department --</option>
                  {DEPARTMENTS.map((dept) => (
                    <option key={dept} value={dept}>
                      {dept}
                    </option>
                  ))}
                </select>
                {errors.department && (
                  <span className="error-message">{errors.department}</span>
                )}
              </div>

              {/* Position */}
              <div className="form-group">
                <label className="form-label">
                  Position / Role <span className="required">*</span>
                </label>
                <input
                  type="text"
                  name="position"
                  className={`form-control ${errors.position ? 'error' : ''}`}
                  placeholder="e.g. Senior Software Engineer"
                  value={formData.position}
                  onChange={handleChange}
                />
                {errors.position && (
                  <span className="error-message">{errors.position}</span>
                )}
              </div>

              {/* Salary */}
              <div className="form-group">
                <label className="form-label">
                  Annual Salary (USD) <span className="required">*</span>
                </label>
                <input
                  type="number"
                  name="salary"
                  min="0"
                  step="500"
                  className={`form-control ${errors.salary ? 'error' : ''}`}
                  placeholder="e.g. 85000"
                  value={formData.salary}
                  onChange={handleChange}
                />
                {errors.salary && (
                  <span className="error-message">{errors.salary}</span>
                )}
              </div>

              {/* Joining Date */}
              <div className="form-group">
                <label className="form-label">
                  Joining Date <span className="required">*</span>
                </label>
                <input
                  type="date"
                  name="joiningDate"
                  className={`form-control ${errors.joiningDate ? 'error' : ''}`}
                  value={formData.joiningDate}
                  onChange={handleChange}
                />
                {errors.joiningDate && (
                  <span className="error-message">{errors.joiningDate}</span>
                )}
              </div>

              {/* Status */}
              <div className="form-group full-width">
                <label className="form-label">
                  Employment Status <span className="required">*</span>
                </label>
                <div style={{ display: 'flex', gap: '24px', marginTop: '6px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '14px' }}>
                    <input
                      type="radio"
                      name="status"
                      value="Active"
                      checked={formData.status === 'Active'}
                      onChange={handleChange}
                    />
                    Active
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '14px' }}>
                    <input
                      type="radio"
                      name="status"
                      value="Inactive"
                      checked={formData.status === 'Inactive'}
                      onChange={handleChange}
                    />
                    Inactive
                  </label>
                </div>
              </div>
            </div>

            <div className="form-actions">
              <Link to="/employees" className="btn-secondary">
                Cancel
              </Link>
              <button
                type="submit"
                className="btn-primary"
                disabled={submitting}
              >
                {submitting ? 'Creating Employee...' : 'Save Employee'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
