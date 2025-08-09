import React from 'react';
import './CheckBox.css';

const Checkbox = ({ label, checked, onChange, id }) => {
  return (
    <label className="custom-checkbox">
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={onChange}
      />
      <span>{label}</span>
    </label>
  );
};

export default Checkbox;
