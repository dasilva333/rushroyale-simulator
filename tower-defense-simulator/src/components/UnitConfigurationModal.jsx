import React, { useEffect } from 'react';
import CheckboxField from './Fields/CheckboxField';
import NumberInput from './Fields/NumberInput';
import SelectWithMinMax from './Fields/SelectWithMinMax';

import fieldToComponentSpec from '../data/fieldToComponentSpec.json';
import unitConfiguration from '../data/unitConfiguration.json';

function UnitConfigurationModal({ unit, onConfirm, onConfigChange }) {
  const { fields, defaults } = unitConfiguration[unit ? unit.name.toLowerCase() : ''] || {};

  useEffect(() => {
    if (unit) {
      onConfigChange(defaults);
    }
  }, [unit]);

  if (!unit) return null;

  const handleChange = (fieldName, event) => {
    onConfigChange({ [fieldName]: event.target.value });
  };

  return (
    <div className="unit-configuration-modal modal show d-block">
      <div className="modal-dialog modal-lg modal-dialog-scrollable">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Configure {unit.name}</h5>
          </div>
          <div className="modal-body">
            {fields.map(fieldName => {
              const fieldSpec = fieldToComponentSpec[fieldName];
              const fieldProps = {
                ...fieldSpec,
                defaultValue: defaults[fieldName] || (fieldSpec.defaultValue || undefined),
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
