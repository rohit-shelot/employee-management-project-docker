import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import StatusBadge from '../components/StatusBadge';
import ConfirmModal from '../components/ConfirmModal';
import { getEmployeeById, deleteEmployee } from '../services/api';

export default function EmployeeDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        setLoading(true);
        const res = await getEmployeeById(id);
        setEmployee(res.data || res);
      } catch (err) {
        toast.error(err.message || 'Failed to load employee details');
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployee();
  }, [id]);

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await deleteEmployee(id);
      toast.success(`Employee "${employee.fullName}" deleted successfully.`);
      navigate('/employees');
    } catch (err) {
      toast.error(err.message || 'Failed to delete employee');
      setShowDeleteModal(false);
    } finally {
      setIsDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="card">
        <div className="card-body">
          <p>Loading employee record...</p>
        </div>
      </div>
    );
  }

  if (notFound || !employee) {
    return (
      <div>
        <div className="alert alert-danger">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          <span>Employee not found or could not be loaded.</span>
        </div>
        <Link to="/employees" className="btn-secondary">
          &larr; Back to Employees
        </Link>
      </div>
    );
  }

  // Generate initials for avatar
  const initials = employee.fullName
    ? employee.fullName
        .split(' ')
        .map((n) => n[0])
        .join('')
        .slice(0, 2)
        .toUpperCase()
    : 'EM';

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">{employee.fullName}</h1>
          <p className="page-subtitle">Complete profile and employment record</p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <Link to="/employees" className="btn-secondary">
            &larr; Back to List
          </Link>
          <Link to={`/employees/edit/${employee._id}`} className="btn-primary">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
            Edit Record
          </Link>
          <button
            type="button"
            className="btn-danger"
            onClick={() => setShowDeleteModal(true)}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: '6px', verticalAlign: 'middle' }}>
              <polyline points="3 6 5 6 21 6" />
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
            </svg>
            Delete
          </button>
        </div>
      </div>

      <div className="card" style={{ maxWidth: '850px' }}>
        {/* Profile Card Header */}
        <div
          style={{
            padding: '24px',
            borderBottom: '1px solid var(--border)',
            display: 'flex',
            alignItems: 'center',
            gap: '20px',
            backgroundColor: '#f8fafc',
          }}
        >
          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, var(--primary), #818cf8)',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '22px',
              fontWeight: 700,
              flexShrink: 0,
            }}
          >
            {initials}
          </div>

          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-main)' }}>
                {employee.fullName}
              </h2>
              <StatusBadge status={employee.status} />
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginTop: '2px' }}>
              {employee.position} &bull; {employee.department}
            </p>
          </div>

          <div>
            <span className="emp-id-badge" style={{ fontSize: '14px', padding: '6px 12px' }}>
              {employee.employeeId}
            </span>
          </div>
        </div>

        {/* Profile Details Grid */}
        <div className="card-body">
          <div className="detail-grid">
            <div className="detail-item">
              <span className="detail-label">Employee ID</span>
              <span className="detail-value">{employee.employeeId}</span>
            </div>

            <div className="detail-item">
              <span className="detail-label">Full Name</span>
              <span className="detail-value">{employee.fullName}</span>
            </div>

            <div className="detail-item">
              <span className="detail-label">Work Email</span>
              <span className="detail-value">
                <a href={`mailto:${employee.email}`} style={{ color: 'var(--primary)', textDecoration: 'none' }}>
                  {employee.email}
                </a>
              </span>
            </div>

            <div className="detail-item">
              <span className="detail-label">Phone Number</span>
              <span className="detail-value">{employee.phone || 'Not specified'}</span>
            </div>

            <div className="detail-item">
              <span className="detail-label">Department</span>
              <span className="detail-value">{employee.department}</span>
            </div>

            <div className="detail-item">
              <span className="detail-label">Position / Role</span>
              <span className="detail-value">{employee.position}</span>
            </div>

            <div className="detail-item">
              <span className="detail-label">Annual Salary</span>
              <span className="detail-value" style={{ fontWeight: 600, color: '#047857' }}>
                ${Number(employee.salary || 0).toLocaleString()} USD
              </span>
            </div>

            <div className="detail-item">
              <span className="detail-label">Joining Date</span>
              <span className="detail-value">
                {employee.joiningDate
                  ? new Date(employee.joiningDate).toLocaleDateString(undefined, {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })
                  : 'N/A'}
              </span>
            </div>

            <div className="detail-item">
              <span className="detail-label">Employment Status</span>
              <span className="detail-value">
                <StatusBadge status={employee.status} />
              </span>
            </div>

            <div className="detail-item">
              <span className="detail-label">Record Created</span>
              <span className="detail-value" style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                {employee.createdAt ? new Date(employee.createdAt).toLocaleString() : 'N/A'}
              </span>
            </div>
          </div>
        </div>
      </div>

      <ConfirmModal
        isOpen={showDeleteModal}
        title="Delete Employee"
        message={`Are you sure you want to delete ${employee.fullName} (${employee.employeeId})? This action cannot be undone.`}
        confirmText="Confirm Delete"
        isLoading={isDeleting}
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteModal(false)}
      />
    </div>
  );
}
