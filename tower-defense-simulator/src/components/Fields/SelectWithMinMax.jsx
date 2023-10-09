import React from 'react';
import unitsService from '../../data/unitsService';

function SelectWithMinMax({ options, value, onChange, label }) {
  const resolvedOptions = unitsService[options] || [];
  
  return (
    <div className="mb-3">
      {label && <label className="form-label d-block mb-2">{label}</label>}
      <div className="d-flex align-items-center">
        <select className="form-select flex-grow-1 me-2" style={{ flexBasis: '70%' }} value={value} onChange={onChange}>
          {resolvedOptions.map(option => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        <div className="d-flex flex-grow-0" style={{ flexBasis: '30%' }}>
    <button className="btn btn-secondary me-2" onClick={() => onChange({ target: { value: resolvedOptions[0] } })}>Min</button>
    <button className="btn btn-secondary" onClick={() => onChange({ target: { value: resolvedOptions[resolvedOptions.length - 1] } })}>Max</button>
</div>

      </div>
    </div>
  );
}

export default SelectWithMinMax;
