import React from 'react';

function CheckboxField({ defaultValue, label, onChange }) {
    return (
        <div className="form-check">
            <input 
                type="checkbox"
                className="form-check-input" 
                id="checkboxField"
                defaultChecked={defaultValue} 
                onChange={onChange}
            />
            {label && <label className="form-check-label" htmlFor="checkboxField">{label}</label>}
        </div>
    );
}

export default CheckboxField;