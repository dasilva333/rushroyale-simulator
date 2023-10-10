import React from 'react';
import { rehydrateUnit } from '../utils/unitUtilities';

function GridCell({ x, y, unit, unitConfig, onSelect }) {
    const UnitComponent = unit && rehydrateUnit(unit).component;
    return (
        <div className="grid-cell" onClick={() => onSelect(x, y)}>
            {UnitComponent && <UnitComponent unit={unit} />}
        </div>
    );
}

export default GridCell;