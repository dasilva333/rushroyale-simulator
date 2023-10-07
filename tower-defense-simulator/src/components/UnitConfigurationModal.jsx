import React, { useEffect } from 'react';
import CheckboxField from './Fields/CheckboxField';
import NumberInput from './Fields/NumberInput';
import SelectWithMinMax from './Fields/SelectWithMinMax';
import '../styles/board.scss';

import fieldToComponentSpec from '../data/fieldToComponentSpec.json';
import unitConfiguration from '../data/unitConfiguration.json';

function UnitConfigurationModal({ unit, onConfirm, onConfigChange }) {
  const { fields, defaults } = unitConfiguration[unit ? unit.name.toLowerCase() : ''] || {};

  useEffect(() => {
    // Pre-populate the configurations using default values only if 'unit' exists
    if (unit) {
      onConfigChange(defaults);
    }
  }, [unit]);

  if (!unit) return null;

  const handleChange = (fieldName, event) => {
    onConfigChange({ [fieldName]: event.target.value });
  };

  console.log('fields', fields);

  return (
    <div className="unit-configuration-modal">
      {fields.map(fieldName => {
        const fieldSpec = fieldToComponentSpec[fieldName];
        console.log(`fieldSpec: ${fieldName}`, fieldSpec);
        const fieldProps = {
          ...fieldSpec,
          defaultValue: defaults[fieldName],
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
      <button onClick={onConfirm}>Confirm</button>
    </div>
  );
}

export default UnitConfigurationModal;
