import React from 'react';

function CheckboxField({ defaultValue, label, onChange }) {
    return (
        <div>
            {label && <label>{label}</label>}
            <input 
                type="checkbox" 
                defaultChecked={defaultValue} 
                onChange={onChange}
            />
        </div>
    );
}

export default CheckboxField;
