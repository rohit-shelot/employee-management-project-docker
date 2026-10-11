import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import StatCard from '../components/StatCard';
import StatusBadge from '../components/StatusBadge';
import { getDashboardStats, getEmployees } from '../services/api';

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalEmployees: 0,
    activeEmployees: 0,
    inactiveEmployees: 0,
    totalDepartments: 0,
    departmentBreakdown: [],
  });
  const [recentEmployees, setRecentEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      const [statsRes, employeesRes] = await Promise.all([
        getDashboardStats(),
        getEmployees(),
      ]);

      const statsData = statsRes.data || statsRes;
      setStats({
        totalEmployees: statsData.totalEmployees ?? 0,
        activeEmployees: statsData.activeEmployees ?? 0,
        inactiveEmployees: statsData.inactiveEmployees ?? 0,
        totalDepartments: statsData.totalDepartments ?? 0,
        departmentBreakdown: statsData.departmentBreakdown ?? [],
      });

      const empList = employeesRes.data || employeesRes || [];
      setRecentEmployees(empList.slice(0, 5));
    } catch (err) {
      toast.error(err.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="page-subtitle">Real-time workforce metrics and department distribution</p>
        </div>
        <button
          type="button"
          className="btn-secondary"
          onClick={fetchDashboardData}
          disabled={loading}
        >
          {loading ? 'Refreshing...' : 'Refresh Data'}
        </button>
      </div>


      {/* 4 Stat Cards */}
      <div className="stat-cards-grid">
        <StatCard
          label="Total Employees"
          value={stats.totalEmployees}
          color="indigo"
          icon={
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          }
        />

        <StatCard
          label="Active Employees"
          value={stats.activeEmployees}
          color="green"
          icon={
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
          }
        />

        <StatCard
          label="Inactive Employees"
          value={stats.inactiveEmployees}
          color="amber"
          icon={
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <line x1="15" y1="9" x2="9" y2="15" />
              <line x1="9" y1="9" x2="15" y2="15" />
            </svg>
          }
        />

        <StatCard
          label="Total Departments"
          value={stats.totalDepartments}
          color="purple"
          icon={
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
              <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
            </svg>
          }
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
        {/* Recent Employees Table */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Recent Employees</h3>
            <Link to="/employees" style={{ fontSize: '13px', color: 'var(--primary)', textDecoration: 'none', fontWeight: 600 }}>
              View All &rarr;
            </Link>
          </div>
          <div className="table-responsive">
            {recentEmployees.length === 0 && !loading ? (
              <div className="empty-state">
                <p>No employee records found.</p>
                <Link to="/employees/new" className="btn-primary-sm" style={{ marginTop: '12px' }}>
                  Add First Employee
                </Link>
              </div>
            ) : (
              <table className="data-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Department</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentEmployees.map((emp) => (
                    <tr key={emp._id}>
                      <td>
                        <span className="emp-id-badge">{emp.employeeId}</span>
                      </td>
                      <td>
                        <div className="emp-name-cell">
                          <span className="emp-name">{emp.fullName}</span>
                          <span className="emp-email">{emp.position}</span>
                        </div>
                      </td>
                      <td>{emp.department}</td>
                      <td>
                        <StatusBadge status={emp.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Department Overview */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Department Breakdown</h3>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
              {stats.totalDepartments} Active Units
            </span>
          </div>
          <div className="card-body">
            {stats.departmentBreakdown.length === 0 ? (
              <div className="empty-state">
                <p>No department data yet.</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {stats.departmentBreakdown.map((item) => {
                  const percentage = stats.totalEmployees > 0
                    ? Math.round((item.count / stats.totalEmployees) * 100)
                    : 0;
                  return (
                    <div key={item._id} style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', fontWeight: 500 }}>
                        <span>{item._id || 'Unassigned'}</span>
                        <span style={{ color: 'var(--text-muted)' }}>
                          {item.count} employees ({percentage}%)
                        </span>
                      </div>
                      <div style={{ height: '8px', backgroundColor: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
                        <div
                          style={{
                            height: '100%',
                            width: `${percentage}%`,
                            backgroundColor: 'var(--primary)',
                            borderRadius: '4px',
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
