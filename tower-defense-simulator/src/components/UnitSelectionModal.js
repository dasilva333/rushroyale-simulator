import React from 'react';
import { availableUnits } from '../utils/unitUtilities';
import '../styles/board.scss';

function UnitSelectionModal({ onSelect, onClose }) {
    return (
        <div className="unit-selection-modal">
            <ul>
                {availableUnits.map((unit, index) => (
                    <li key={index} onClick={() => { onSelect(unit); }}>
                        <img src={unit.class.baseImage} alt={unit.name} width="60" />
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default UnitSelectionModal;
