import React, { useEffect, useState } from 'react';
import CheckboxField from './Fields/CheckboxField';
import NumberInput from './Fields/NumberInput';
import SelectWithMinMax from './Fields/SelectWithMinMax';
import UnitTalentConfigurationModal from './UnitTalentConfigurationModal'; // import this

import fieldToComponentSpec from '../data/fieldToComponentSpec.json';
import unitConfiguration from '../data/unitConfiguration.json';

function UnitConfigurationModal({ unit, unitConfig, onConfirm, onConfigChange }) {
  const [showTalentModal, setShowTalentModal] = useState(false); // state for modal visibility
  
  const config = unitConfiguration[unit ? unit.name.toLowerCase() : ''];
  const { fields, defaults } = config || {};

  const combinedFieldsSet = new Set(['swordStacks', ...(fields || []), ...(Object.keys(defaults || {}))]);
  const combinedFields = [...combinedFieldsSet];
  
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
    <div className="unit-configuration-modal modal show d-block">
      <div className="modal-dialog modal-lg modal-dialog-scrollable">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Configure {unit.name}</h5>
          </div>
          <div className="modal-body">
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
          </div>
          <div className="modal-footer">
            <button className="btn btn-secondary mr-2" onClick={openTalentConfiguration}>Talent Configuration</button>
            <button className="btn btn-primary" onClick={onConfirm}>Confirm</button>
          </div>
        </div>
      </div>
      {showTalentModal && 
        <UnitTalentConfigurationModal 
          unit={unit} 
          unitConfig={unitConfig} 
          onTalentConfigChange={(newConfig) => { 
            onConfigChange(newConfig);
            setShowTalentModal(false); // close the talent modal after change
          }} 
        />}
    </div>
  );
}

export default UnitConfigurationModal;
