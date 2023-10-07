import React from 'react';

function NumberInput({ inputType, defaultValue, label, onChange }) {
    return (
        <div>
            {label && <label>{label}</label>}
            <input 
                type={inputType || 'number'} 
                defaultValue={defaultValue} 
                onChange={onChange}
            />
        </div>
    );
}

export default NumberInput;
