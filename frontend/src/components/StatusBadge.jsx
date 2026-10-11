import React from 'react';

export default function StatusBadge({ status }) {
  const isActionActive = status === 'Active';
  return (
    <span className={`status-badge ${isActionActive ? 'active' : 'inactive'}`}>
      <span
        style={{
          width: '6px',
          height: '6px',
          borderRadius: '50%',
          backgroundColor: isActionActive ? '#10b981' : '#64748b',
          display: 'inline-block',
        }}
      />
      {status}
    </span>
  );
}
