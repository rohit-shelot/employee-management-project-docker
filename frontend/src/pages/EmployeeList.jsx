import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import StatusBadge from '../components/StatusBadge';
import ConfirmModal from '../components/ConfirmModal';
import { getEmployees, deleteEmployee } from '../services/api';

export default function EmployeeList() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

  // Search & Filters state
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDept, setSelectedDept] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');

  // Delete modal state
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchEmployeesList = async () => {
    try {
      setLoading(true);
      const params = {};
      if (searchTerm.trim()) params.search = searchTerm.trim();
      if (selectedDept !== 'All') params.department = selectedDept;
      if (selectedStatus !== 'All') params.status = selectedStatus;

      const res = await getEmployees(params);
      const list = res.data || res || [];
      setEmployees(list);
    } catch (err) {
      toast.error(err.message || 'Failed to fetch employees');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Debounce search slightly for smooth user input
    const timeout = setTimeout(() => {
      fetchEmployeesList();
    }, 250);
    return () => clearTimeout(timeout);
  }, [searchTerm, selectedDept, selectedStatus]);

  const handleClearFilters = () => {
    setSearchTerm('');
    setSelectedDept('All');
    setSelectedStatus('All');
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;

    try {
      setIsDeleting(true);
      await deleteEmployee(deleteTarget._id);
      toast.success(`Employee "${deleteTarget.fullName}" (${deleteTarget.employeeId}) deleted successfully.`);
      setDeleteTarget(null);
      fetchEmployeesList();
    } catch (err) {
      toast.error(err.message || 'Failed to delete employee');
    } finally {
      setIsDeleting(false);
    }
  };

  // Derive unique department options from existing records + standard defaults
  const departments = Array.from(
    new Set([
      'Engineering',
      'Human Resources',
      'Operations',
      'Design',
      'Marketing',
      'Finance',
      ...employees.map((e) => e.department).filter(Boolean),
    ])
  ).sort();

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Employees Directory</h1>
          <p className="page-subtitle">Manage, search, and monitor all organization staff</p>
        </div>
        <Link to="/employees/new" className="btn-primary">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Add Employee
        </Link>
      </div>

      {/* Filter & Search Bar */}
      <div className="card" style={{ marginBottom: '20px' }}>
        <div className="card-body" style={{ padding: '16px 20px' }}>
          <div className="filter-bar" style={{ margin: 0 }}>
            <div className="search-input-wrapper">
              <svg className="search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                type="text"
                className="search-input"
                placeholder="Search by name, ID, email, position..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <select
              className="filter-select"
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
            >
              <option value="All">All Departments</option>
              {departments.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>

            <select
              className="filter-select"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
            >
              <option value="All">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>

            {(searchTerm || selectedDept !== 'All' || selectedStatus !== 'All') && (
              <button
                type="button"
                className="btn-secondary"
                onClick={handleClearFilters}
              >
                Clear Filters
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Employees Table Card */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">
            Employee Records ({employees.length})
          </h3>
          <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
            {loading ? 'Updating...' : 'Live & Up to date'}
          </span>
        </div>

        <div className="table-responsive">
          {loading && employees.length === 0 ? (
            <div className="empty-state">
              <p>Loading employee records...</p>
            </div>
          ) : employees.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <line x1="17" y1="11" x2="23" y2="11" />
                </svg>
              </div>
              <p style={{ fontWeight: 600, fontSize: '16px' }}>No employees found</p>
              <p style={{ fontSize: '13px', marginTop: '4px' }}>
                Try adjusting your search criteria or add a new employee.
              </p>
              <Link to="/employees/new" className="btn-primary-sm" style={{ marginTop: '16px' }}>
                Add New Employee
              </Link>
            </div>
          ) : (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Employee ID</th>
                  <th>Full Name &amp; Email</th>
                  <th>Department</th>
                  <th>Position</th>
                  <th>Salary</th>
                  <th>Joining Date</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {employees.map((emp) => (
                  <tr key={emp._id}>
                    <td>
                      <span className="emp-id-badge">{emp.employeeId}</span>
                    </td>
                    <td>
                      <div className="emp-name-cell">
                        <span className="emp-name">{emp.fullName}</span>
                        <span className="emp-email">{emp.email}</span>
                      </div>
                    </td>
                    <td>{emp.department}</td>
                    <td>{emp.position}</td>
                    <td>
                      ${Number(emp.salary || 0).toLocaleString()}
                    </td>
                    <td>
                      {emp.joiningDate
                        ? new Date(emp.joiningDate).toLocaleDateString(undefined, {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                          })
                        : '-'}
                    </td>
                    <td>
                      <StatusBadge status={emp.status} />
                    </td>
                    <td>
                      <div className="action-buttons" style={{ justifyContent: 'flex-end' }}>
                        <Link
                          to={`/employees/${emp._id}`}
                          className="btn-action view"
                          title="View Details"
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                            <circle cx="12" cy="12" r="3" />
                          </svg>
                        </Link>
                        <Link
                          to={`/employees/edit/${emp._id}`}
                          className="btn-action edit"
                          title="Edit Employee"
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                          </svg>
                        </Link>
                        <button
                          type="button"
                          className="btn-action delete"
                          title="Delete Employee"
                          onClick={() => setDeleteTarget(emp)}
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="3 6 5 6 21 6" />
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                            <line x1="10" y1="11" x2="10" y2="17" />
                            <line x1="14" y1="11" x2="14" y2="17" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={Boolean(deleteTarget)}
        title="Delete Employee Record"
        message={
          deleteTarget
            ? `Are you sure you want to permanently delete employee "${deleteTarget.fullName}" (${deleteTarget.employeeId})? This action cannot be undone.`
            : ''
        }
        confirmText="Confirm Delete"
        isLoading={isDeleting}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
