import React from 'react';
import unitsService from '../../data/unitsService';  // adjust the path accordingly

function SelectWithMinMax({ options, value, onChange, label }) {
  const resolvedOptions = unitsService[options] || [];
  
  return (
    <div>
      <label>{label}</label>
      <select value={value} onChange={onChange}>
        {resolvedOptions.map(option => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      <button onClick={() => onChange({ target: { value: resolvedOptions[0] } })}>Min</button>
      <button onClick={() => onChange({ target: { value: resolvedOptions[resolvedOptions.length - 1] } })}>Max</button>
    </div>
  );
}

export default SelectWithMinMax;
