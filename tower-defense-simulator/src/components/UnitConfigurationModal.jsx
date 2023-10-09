import React, { useEffect } from 'react';
import CheckboxField from './Fields/CheckboxField';
import NumberInput from './Fields/NumberInput';
import SelectWithMinMax from './Fields/SelectWithMinMax';

import fieldToComponentSpec from '../data/fieldToComponentSpec.json';
import unitConfiguration from '../data/unitConfiguration.json';

function UnitConfigurationModal({ unit, unitConfig, onConfirm, onConfigChange }) {
  const config = unitConfiguration[unit ? unit.name.toLowerCase() : ''];
  const { fields, defaults } = config || {};

  const combinedFieldsSet = new Set([...(fields || []), ...(Object.keys(defaults || {}))]);
  const combinedFields = [...combinedFieldsSet];
  
  // Set merged default values
  useEffect(() => {
    if (unit && !Object.keys(unitConfig).length) {
      const mergedDefaults = combinedFields.reduce((acc, key) => {
        acc[key] = unitConfig[key] || defaults[key] || fieldToComponentSpec[key]?.defaultValue;
        return acc;
      }, {});
      onConfigChange(mergedDefaults);
    }
  }, [unit, onConfigChange, defaults, unitConfig]);

  if (!unit) return null;

  const handleChange = (fieldName, event) => {
    let changeObj = { [fieldName]: event.target.type === 'checkbox' ? event.target.checked : event.target.value };
    onConfigChange(changeObj);
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
            <button className="btn btn-primary" onClick={onConfirm}>Confirm</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UnitConfigurationModal;
