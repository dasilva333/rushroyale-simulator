function NumberInput({ inputType, value, defaultValue, label, onChange }) {
    const fieldId = `input-${label}`;

    return (
        <div className="mb-3">
            {label && <label className="form-label" htmlFor={fieldId}>{label}</label>}
            <input 
                type={inputType || 'number'}
                className="form-control"
                id={fieldId}
                value={value || defaultValue || ''}  // Use an empty string as default if value is undefined
                onChange={onChange}
            />
        </div>
    );
}

export default NumberInput;
