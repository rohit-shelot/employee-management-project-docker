import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getEmployeeById, updateEmployee } from '../services/api';

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

export default function EditEmployee() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    employeeId: '',
    fullName: '',
    email: '',
    phone: '',
    department: '',
    position: '',
    salary: '',
    joiningDate: '',
    status: 'Active',
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        setLoading(true);
        const res = await getEmployeeById(id);
        const emp = res.data || res;

        if (emp) {
          setFormData({
            employeeId: emp.employeeId || '',
            fullName: emp.fullName || '',
            email: emp.email || '',
            phone: emp.phone || '',
            department: emp.department || '',
            position: emp.position || '',
            salary: emp.salary ?? '',
            joiningDate: emp.joiningDate
              ? new Date(emp.joiningDate).toISOString().split('T')[0]
              : '',
            status: emp.status || 'Active',
          });
        }
      } catch (err) {
        toast.error(err.message || 'Failed to fetch employee details');
      } finally {
        setLoading(false);
      }
    };

    fetchEmployee();
  }, [id]);

  const validate = () => {
    const newErrors = {};

    if (!formData.employeeId.trim()) {
      newErrors.employeeId = 'Employee ID is required';
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
      await updateEmployee(id, {
        ...formData,
        employeeId: formData.employeeId.trim().toUpperCase(),
        salary: Number(formData.salary),
      });

      toast.success(`Employee "${formData.fullName}" updated successfully!`);
      navigate('/employees');
    } catch (err) {
      toast.error(err.message || 'Failed to update employee');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="card">
        <div className="card-body">
          <p>Loading employee data for editing...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Edit Employee</h1>
          <p className="page-subtitle">Update information for {formData.fullName || 'Employee'}</p>
        </div>
        <Link to="/employees" className="btn-secondary">
          &larr; Back to Employees
        </Link>
      </div>

      <div className="card" style={{ maxWidth: '800px' }}>
        <div className="card-header">
          <h3 className="card-title">Update Record</h3>
          <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
            Editing ID: {formData.employeeId}
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
                {submitting ? 'Updating...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
