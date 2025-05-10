import React from 'react';

export default function Card({ children, className = '' }) {
  return (
    <div className={`border rounded shadow-sm ${className}`}>
      {children}
    </div>
  );
}