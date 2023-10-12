import React from 'react';
import TalentsManager from '../classes/TalentsManager';
import { Modal, Button, Row, Col } from 'react-bootstrap';

function RadioSwitch({ talent, talentsManager, unitConfig, tierIndex, handleTalentChange }) {
    const isSelected = talentsManager.getInstanceTalentProperty(talent.name, 'selected');
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
                    checked={isSelected || false}
                    onChange={e => {
                        const isChecked = e.target.checked;
                        handleTalentChange(talent.name, tierIndex, isChecked)
                    }}
                />
            </div>
        </div>
    );
}

function CheckboxSwitch({ talent, talentsManager, unitConfig, tierIndex, handleTalentChange }) {
    const isSelected = talentsManager.getInstanceTalentProperty(talent.name, 'selected');
    return (
        <div>
            <div className="form-check">
                <input
                    className="form-check-input"
                    type="checkbox"
                    name={talent.name}
                    id={`checkbox-${talent.name}`}
                    checked={isSelected || false}
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

function UnitTalentConfigurationModal({ unit, unitConfig, setUnitConfig, onTalentConfigChange }) {
    const talentsManager = new TalentsManager(unit.name, unitConfig.talents);  // Initialize TalentsManager
    const unitTalents = talentsManager.getUnitTalents();  // Using TalentsManager method

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
                                    <RadioSwitch talentsManager={talentsManager} unitConfig={unitConfig} talent={talent} tierIndex={idx} handleTalentChange={handleTalentChange} />
                                    :
                                    <CheckboxSwitch talentsManager={talentsManager} unitConfig={unitConfig} talent={talent} tierIndex={idx} handleTalentChange={handleTalentChange} />
                                }
                                <TalentExtraFields talentsManager={talentsManager} unitConfig={unitConfig} talent={talent} handleTalentChange={handleTalentChange} />
                            </Col>
                        ))}
                    </Row>
                ))}
            </Modal.Body>
        </Modal>
    );
    

}

function TalentExtraFields({ talent, talentsManager, handleTalentChange }) {
    // Check if talent has extraFields and if the talent is selected using talentsManager
    const isTalentSelected = talentsManager.getInstanceTalentProperty(talent.name, 'selected');
    if (!talent.extraFields || !isTalentSelected) return null;  // Return early if no extra fields or if the talent isn't selected.

    return (
        <div>
            {talent.extraFields.map(field => (
                renderExtraField(field, talent.name, talentsManager, handleTalentChange)
            ))}
        </div>
    );
}
function renderExtraField(field, talentName, talentsManager, handleTalentChange) {
    const fieldName = `${talentName}-${field.name}`;
    const fieldValue = talentsManager.getInstanceTalentProperty(talentName, field.name);

    switch (field.type) {
        case 'number':
            return (
                <div key={fieldName} className="form-group">
                    <label htmlFor={fieldName}>{field.label}</label>
                    <input
                        type="number"
                        className="form-control"
                        id={fieldName}
                        defaultValue={fieldValue || field.default}
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
                        defaultChecked={fieldValue || field.default}
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
