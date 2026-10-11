import React from 'react';

export default function StatCard({ label, value, icon, color = 'indigo' }) {
  return (
    <div className="stat-card">
      <div className={`stat-icon-wrapper ${color}`}>
        {icon}
      </div>
      <div className="stat-info">
        <span className="stat-label">{label}</span>
        <span className="stat-value">{value ?? '0'}</span>
      </div>
    </div>
  );
}
