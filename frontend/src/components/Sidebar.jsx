import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { getHealth } from '../services/api';

export default function Sidebar({ isOpen, onClose }) {
  const [isApiHealthy, setIsApiHealthy] = useState(false);

  useEffect(() => {
    const checkApi = async () => {
      try {
        const res = await getHealth();
        if (res.status === 'OK') {
          setIsApiHealthy(true);
        }
      } catch {
        setIsApiHealthy(false);
      }
    };

    checkApi();
    const interval = setInterval(checkApi, 20000); // Check every 20s
    return () => clearInterval(interval);
  }, []);

  return (
    <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
      <div className="sidebar-header">
        <img
          src="/logo.jpg"
          alt="PeopleSync Logo"
          style={{ width: '40px', height: '40px', borderRadius: '10px', objectFit: 'cover', flexShrink: 0 }}
        />
        <div>
          <span className="sidebar-title">PeopleSync</span>
          <span className="sidebar-sub">HR Management Platform</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        <NavLink
          to="/"
          end
          className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          onClick={onClose}
        >
          <svg
            className="nav-icon"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="3" y="3" width="7" height="9" />
            <rect x="14" y="3" width="7" height="5" />
            <rect x="14" y="12" width="7" height="9" />
            <rect x="3" y="16" width="7" height="5" />
          </svg>
          Dashboard
        </NavLink>

        <NavLink
          to="/employees"
          end
          className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          onClick={onClose}
        >
          <svg
            className="nav-icon"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
          </svg>
          Employees
        </NavLink>

        <NavLink
          to="/employees/new"
          className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          onClick={onClose}
        >
          <svg
            className="nav-icon"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="16" />
            <line x1="8" y1="12" x2="16" y2="12" />
          </svg>
          Add Employee
        </NavLink>
      </nav>

      <div className="sidebar-footer">
        <div className="system-status-indicator">
          <span className={`status-dot ${isApiHealthy ? '' : 'offline'}`} />
          <span>System: {isApiHealthy ? 'Online' : 'Offline'}</span>
        </div>
      </div>
    </aside>
  );
}
