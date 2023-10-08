import React from 'react';
import unitsService from '../../data/unitsService';  // adjust the path accordingly

function SelectWithMinMax({ options, value, onChange, label }) {
  const resolvedOptions = unitsService[options] || [];
  
  return (
    <div className="mb-3">
      <label>{label}</label>
      <select className="form-select" value={value} onChange={onChange}>
        {resolvedOptions.map(option => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      <div className="mt-2">
        <button className="btn btn-secondary me-2" onClick={() => onChange({ target: { value: resolvedOptions[0] } })}>Min</button>
        <button className="btn btn-secondary" onClick={() => onChange({ target: { value: resolvedOptions[resolvedOptions.length - 1] } })}>Max</button>
      </div>
    </div>
  );
}

export default SelectWithMinMax;