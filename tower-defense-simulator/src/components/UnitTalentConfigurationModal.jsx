import React, { useState, useEffect } from 'react';
import availableTalents from '../data/UnitTalentsStore';
import staticUnitConfig from '../data/staticUnitConfig.json';
import { Modal, Button, Row, Col } from 'react-bootstrap';

function RadioSwitch({ talent, unitConfig, tierIndex, handleTalentChange }) {
    return (
        <div className="col">
            <div className="form-check">
                <label className="form-check-label" htmlFor={`radio-${talent.name}`}>
                    <strong>{talent.label}</strong>
                </label>
                <input
                    className="form-check-input"
                    type="radio"
                    name={`tier-${tierIndex}`}
                    id={`radio-${talent.name}`}
                    value={talent.name}
                    checked={unitConfig.talents[talent.name].selected || false}  // <- Added this line
                    onChange={e => {
                        const isChecked = e.target.checked;
                        handleTalentChange(talent.name, tierIndex, isChecked)
                    }}
                />
            </div>
        </div>
    );
}

function CheckboxSwitch({ talent, unitConfig, tierIndex, handleTalentChange }) {
    return (
        <div>
            <div className="form-check">
                <input
                    className="form-check-input"
                    type="checkbox"
                    name={talent.name}
                    id={`checkbox-${talent.name}`}
                    checked={unitConfig.talents[talent.name]?.selected || false}  // <- Modified this line
                    onChange={e => {
                        const isChecked = e.target.checked;
                        handleTalentChange(talent.name, tierIndex, isChecked)
                    }}
                />
                <label className="form-check-label" htmlFor={`checkbox-${talent.name}`}>
                    <strong>{talent.label}</strong>
                </label>
            </div>
        </div>
    );
}

function UnitTalentConfigurationModal({ unit, onTalentConfigChange }) {
    const unitTalents = availableTalents.find(t => t.name === unit.name)?.talents || [];
    const [unitConfig, setUnitConfig] = useState({ talents: staticUnitConfig[unit.name] });
    console.log('UnitTalentConfigurationModal', unitConfig);
    const handleTalentChange = (talentName, tierIndex, isChecked) => {
        // Create a shallow copy of the unitConfig state
        const updatedUnitConfig = { ...unitConfig };
        console.log(`handleTalentChange ${talentName}`, tierIndex, isChecked, updatedUnitConfig, unitTalents);
        // Loop through the talents of the specific tier
        // If it's a radio button
        if (unitTalents[tierIndex].length === 2) {
            const tierTalents = unitTalents[tierIndex].map(t => t.name);
            for (const key of tierTalents) {
                updatedUnitConfig.talents[key].selected = key === talentName;
            }
        } else { // If it's a checkbox
            updatedUnitConfig.talents[talentName].selected = isChecked;
        }

        console.log('updatedUnitConfig', updatedUnitConfig);

        // Update the state with the new unitConfig
        setUnitConfig(updatedUnitConfig);
    };


    // ... other code ...
    
    return (
        <Modal show={true} centered>
            <Modal.Header>
                <Button variant="primary" onClick={onTalentConfigChange}>Confirm</Button>
                <Modal.Title>{`Configure ${unit.name} Talents`}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {unitTalents.map((tier, idx) => (
                    <Row key={idx} className="mb-3">
                        {tier.map((talent, talentIndex) => (
                            <Col key={talent.name}>
                                {tier.length === 2 ?
                                    <RadioSwitch unitConfig={unitConfig} talent={talent} tierIndex={idx} handleTalentChange={handleTalentChange} />
                                    :
                                    <CheckboxSwitch unitConfig={unitConfig} talent={talent} tierIndex={idx} handleTalentChange={handleTalentChange} />
                                }
                                <TalentExtraFields unitConfig={unitConfig} talent={talent} handleTalentChange={handleTalentChange} />
                            </Col>
                        ))}
                    </Row>
                ))}
            </Modal.Body>
        </Modal>
    );
    

}

function TalentExtraFields({ talent, unitConfig, handleTalentChange }) {
    // console.log('TalentExtraFields', talent, unitConfig);

    if (!talent.extraFields || !unitConfig.talents[talent.name].selected) return null;  // Return early if no extra fields or if the talent isn't selected.

    return (
        <div>
            {talent.extraFields.map(field => (
                renderExtraField(field, talent.name, unitConfig, handleTalentChange)
            ))}
        </div>
    );
}

function renderExtraField(field, talentName, unitConfig, handleTalentChange) {
    const fieldName = `${talentName}-${field.name}`;
    console.log('fieldName', fieldName, field, unitConfig);
    switch (field.type) {
        case 'number':
            return (
                <div key={fieldName} className="form-group">
                    <label htmlFor={fieldName}>{field.label}</label>
                    <input
                        type="number"
                        className="form-control"
                        id={fieldName}
                        defaultValue={unitConfig.talents[talentName][field.name] || field.default}
                        onChange={e => {
                            // You might want to implement logic to update the unitConfig based on this field change.
                            // handleTalentChange(...);
                        }}
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
                        defaultChecked={unitConfig.talents[talentName][field.name] || field.default}
                        onChange={e => {
                            // You might want to implement logic to update the unitConfig based on this field change.
                            // handleTalentChange(...);
                        }}
                    />
                    <label className="form-check-label" htmlFor={fieldName}>
                        {field.label}
                    </label>
                </div>
            );
        default:
            return null;
    }
}

export default UnitTalentConfigurationModal;
