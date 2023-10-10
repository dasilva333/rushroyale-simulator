import React from 'react';
import availableTalents from '../data/UnitTalentsStore';


function renderExtraField(field, talentName) {
    const fieldName = `${talentName}-${field.name}`;

    switch (field.type) {
        case 'number':
            return (
                <div key={fieldName} className="form-group">
                    <label htmlFor={fieldName}>{field.name}</label>
                    <input 
                        type="number" 
                        className="form-control" 
                        id={fieldName} 
                        defaultValue={field.default}
                    />
                </div>
            );
        case 'checkbox':
            return (
                <div key={fieldName} className="form-check">
                    <input 
                        type="checkbox" 
                        className="form-check-input" 
                        id={fieldName} 
                        defaultChecked={field.default}
                    />
                    <label className="form-check-label" htmlFor={fieldName}>
                        {field.name}
                    </label>
                </div>
            );
        default:
            return null;
    }
}

function UnitTalentConfigurationModal({ unit, unitConfig, onTalentConfigChange }) {
    const unitTalents = availableTalents.find(t => t.name === unit.name)?.talents || [];

    const handleTalentChange = (talentName, event) => {
        // Implement logic to update the talent configuration
        // based on user interaction and propagate changes to the parent.
    };

    return (
        <div className="unit-talent-configuration-modal modal show d-block">
            <div className="modal-dialog modal-lg modal-dialog-scrollable">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">{`Configure ${unit.name} Talents`}</h5>
                    </div>
                    <div className="modal-body">
                        {unitTalents.map((tier, idx) => (
                            <div key={idx} className="mb-3">
                                {tier.map(talent => (
                                    <div key={talent.name}>
                                        {tier.length === 2 ? (
                                            <div className="form-check">
                                                <input
                                                    className="form-check-input"
                                                    type="radio"
                                                    name={`tier-${idx}`}
                                                    id={`radio-${talent.name}`}
                                                    value={talent.name}
                                                    onChange={e => handleTalentChange(talent.name, e)}
                                                />
                                                <label className="form-check-label" htmlFor={`radio-${talent.name}`}>
                                                    <strong>{talent.label}</strong> {talent.description}
                                                </label>
                                            </div>
                                        ) : (
                                            <div className="form-check">
                                                <input
                                                    className="form-check-input"
                                                    type="checkbox"
                                                    name={talent.name}
                                                    id={`checkbox-${talent.name}`}
                                                    checked={!!unitConfig[talent.name]}
                                                    onChange={e => handleTalentChange(talent.name, e)}
                                                />
                                                <label className="form-check-label" htmlFor={`checkbox-${talent.name}`}>
                                                    <strong>{talent.label}</strong> {talent.description}
                                                </label>
                                            </div>
                                        )}
                                        {talent.extraFields?.map(field => (
                renderExtraField(field, talent.name)
            ))}
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>
                    <div className="modal-footer">
                        <button className="btn btn-primary" onClick={onTalentConfigChange}>Confirm</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default UnitTalentConfigurationModal;
