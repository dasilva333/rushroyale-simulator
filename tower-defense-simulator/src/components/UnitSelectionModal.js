import React from 'react';
import { availableUnits } from '../utils/unitUtilities';

function UnitSelectionModal({ onSelect, onClose, globalUnits }) {
    let unitsToShow;

    if (globalUnits.length === 5) {
        const namesInGlobalUnits = globalUnits.filter(Boolean).map(unit => unit.name);
        unitsToShow = availableUnits.filter(unit => namesInGlobalUnits.includes(unit.name));
    } else {
        unitsToShow = availableUnits;
    }

    return (
        <div className="unit-selection-modal">
            <ul>
                {unitsToShow.map((unit, index) => (
                    <li key={index} onClick={() => { onSelect(unit); }}>
                        <img src={unit.class.baseImage} alt={unit.name} width="60" />
                    </li>
                ))}
            </ul>
            <button onClick={onClose}>Close</button>
        </div>
    );
}

export default UnitSelectionModal;
