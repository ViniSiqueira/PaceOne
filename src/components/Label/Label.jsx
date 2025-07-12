import React from 'react';
import './Label.css';

const Label = ({ text, href = '#', onClick, className = '' }) => {
  return (
    <a
      className={`custom-label ${className}`}
      href={href}
      onClick={onClick}
    >
      {text}
    </a>
  );
};

export default Label;
