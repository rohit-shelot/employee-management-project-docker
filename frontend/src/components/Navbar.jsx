import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function Navbar({ onToggleSidebar }) {
  const location = useLocation();

  const getPageTitle = () => {
    const path = location.pathname;
    if (path === '/') return 'Dashboard Overview';
    if (path === '/employees') return 'Employee Directory';
    if (path === '/employees/new') return 'Add New Employee';
    if (path.includes('/edit')) return 'Edit Employee';
    if (path.startsWith('/employees/')) return 'Employee Details';
    return 'Management Portal';
  };

  return (
    <header className="navbar">
      <div className="navbar-left">
        <button
          type="button"
          className="mobile-menu-btn"
          onClick={onToggleSidebar}
          aria-label="Toggle navigation menu"
        >
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>
        <h2 className="navbar-title">{getPageTitle()}</h2>
      </div>

      <div className="navbar-right">
        {location.pathname !== '/employees/new' && (
          <Link to="/employees/new" className="btn-primary-sm">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Add Employee
          </Link>
        )}

        <div className="admin-badge">
          <div className="avatar-circle">A</div>
          <span>Admin</span>
        </div>
      </div>
    </header>
  );
}
