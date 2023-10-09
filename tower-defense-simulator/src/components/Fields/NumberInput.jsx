function CheckboxField({ value, label, onChange }) {
    const fieldId = `checkbox-${label}`;

    return (
        <div className="form-check">
            <input 
                type="checkbox"
                className="form-check-input" 
                id={fieldId}
                checked={value} 
                onChange={onChange}
            />
            {label && <label className="form-check-label" htmlFor={fieldId}>{label}</label>}
        </div>
    );
}

export default CheckboxField;
