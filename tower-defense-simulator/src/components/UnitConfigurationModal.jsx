import React, { useEffect, useState } from 'react';
import CheckboxField from './Fields/CheckboxField';
import NumberInput from './Fields/NumberInput';
import SelectWithMinMax from './Fields/SelectWithMinMax';
import UnitTalentConfigurationModal from './UnitTalentConfigurationModal'; // import this
import { Modal, Button, Row, Col } from 'react-bootstrap';

import fieldToComponentSpec from '../data/fieldToComponentSpec.json';
import unitConfiguration from '../data/unitConfiguration.json';

import '../styles/unit-configuration-modal.scss';

function UnitConfigurationModal({ unit, unitConfig, onConfirm, onConfigChange }) {
  const [showTalentModal, setShowTalentModal] = useState(false); // state for modal visibility

  const config = unitConfiguration[unit ? unit.name.toLowerCase() : ''];
  const { fields, defaults } = config || {};

  const combinedFieldsSet = new Set(['swordStacks', ...(fields || []), ...(Object.keys(defaults || {}))]);
  const combinedFields = [...combinedFieldsSet].sort((a, b) => {
    const priorityA = fieldToComponentSpec[a]?.priority || 0;
    const priorityB = fieldToComponentSpec[b]?.priority || 0;
    return priorityA - priorityB;  // If you want descending order, swap priorityA and priorityB
  });

  useEffect(() => {
    if (unit && !Object.keys(unitConfig).length) {
      const mergedDefaults = combinedFields.reduce((acc, key) => {
        acc[key] = unitConfig[key] || defaults[key] || fieldToComponentSpec[key]?.defaultValue;
        return acc;
      }, {});
      onConfigChange(mergedDefaults);
    }
  }, [unit, onConfigChange, defaults, unitConfig]);

  const handleChange = (fieldName, event) => {
    let changeObj = { [fieldName]: event.target.type === 'checkbox' ? event.target.checked : event.target.value };
    onConfigChange(changeObj);
  };

  const openTalentConfiguration = () => {
    setShowTalentModal(true);
  };

  return (
    <Modal show={true} onHide={onConfirm} centered>
      <Modal.Header className="modal-header-custom">
        <Button variant="light" onClick={() => console.log('cancel')}>Cancel</Button>
        <Button variant="light" onClick={() => console.log('clear')}>Clear</Button>
        <Button variant="light" onClick={() => openTalentConfiguration()}>Talents</Button>
        <Button variant="light" onClick={() => onConfirm()}>Confirm</Button>
        <Button variant="light" onClick={() => console.log('apply to all')}>Apply To All</Button>
        <Modal.Title>Options</Modal.Title>
      </Modal.Header>

      <Modal.Body className="container-fluid d-flex flex-column align-items-center modal-body-scrollable">
                <Row className="w-100 justify-content-center">
 
          {combinedFields && combinedFields.map(fieldName => {
                  const fieldSpec = fieldToComponentSpec[fieldName];
                  const fieldProps = {
                    ...fieldSpec,
                    value: unitConfig[fieldName] || fieldSpec.defaultValue,
                    onChange: event => handleChange(fieldName, event)
                  };

                  switch (fieldSpec.componentType) {
                    case 'input':
                      return <NumberInput {...fieldProps} key={fieldName} />;
                    case 'select':
                      return <SelectWithMinMax {...fieldProps} key={fieldName} />;
                    case 'checkbox':
                      return <CheckboxField {...fieldProps} key={fieldName} />;
                    // ... other cases
                    default:
                      return null;
                  }
                })}

{showTalentModal &&
            <UnitTalentConfigurationModal
              unit={unit}
              unitConfig={unitConfig}
              onTalentConfigChange={(newConfig) => {
                onConfigChange(newConfig);
                setShowTalentModal(false); // close the talent modal after change
              }}
            />
          }
  </Row>
      </Modal.Body>
    </Modal>

  );
}

export default UnitConfigurationModal;
