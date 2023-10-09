import React from 'react';
import GridCell from './GridCell';

function Deck({ globalUnits, onSelect }) {
    return (
        <div className="deck">
            {Array(5).fill(null).map((_, index) => (
                <GridCell 
                    key={index} 
                    x={index} 
                    y={0} 
                    unit={globalUnits && globalUnits[index]}  // check if globalUnits exists
                    onSelect={onSelect}
                />
            ))}
        </div>
    );
}

export default Deck;
