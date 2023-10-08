import React from 'react';

function NumberInput({ inputType, defaultValue, label, onChange }) {
    return (
        <div className="mb-3">
            {label && <label className="form-label">{label}</label>}
            <input 
                type={inputType || 'number'}
                className="form-control" 
                defaultValue={defaultValue} 
                onChange={onChange}
            />
        </div>
    );
}

export default NumberInput;