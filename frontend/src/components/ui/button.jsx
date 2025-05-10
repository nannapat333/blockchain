// src/components/ui/Button.jsx

import React from 'react';

export default function Button({ children, onClick, className = '', ...props }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}