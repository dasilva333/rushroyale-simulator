function NumberInput({ inputType, value, label, onChange }) {
    const fieldId = `input-${label}`;

    return (
        <div className="mb-3">
            {label && <label className="form-label" htmlFor={fieldId}>{label}</label>}
            <input 
                type={inputType || 'number'}
                className="form-control"
                id={fieldId}
                value={value} 
                onChange={onChange}
            />
        </div>
    );
}

export default NumberInput;
