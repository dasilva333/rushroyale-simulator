import React from 'react';
import { useSelector } from 'react-redux';
import { rehydrateUnit } from '../utils/unitUtilities';

function BoardStats({ boardConfig }) {
    const board = useSelector(state => state.present.board);

    const dpsDetails = board.flatMap((row, x) =>
        row.map((unit, y) => {
            if (!unit) return null;
            
            const UnitInstance = rehydrateUnit(unit, x, y).class;
            const primaryDPS = UnitInstance.calculateDPS(boardConfig);
            const altDPS = UnitInstance.calculateAltDPS(boardConfig);
            const dpsInfos = [primaryDPS].concat(altDPS ? [altDPS] : []);
            // console.log(dpsInfos);
            return dpsInfos.map(dpsInfo => ({ unit: UnitInstance, dpsInfo, x, y }));
        })
    ).flat().filter(item => item);

    const totalDPS = dpsDetails.reduce((acc, item) => acc + item.dpsInfo.total, 0);

    return (
        <div className="board-stats">
            <h1><strong>Stats</strong></h1>
            <p>Total DPS: {totalDPS.toLocaleString()}</p>
            {dpsDetails.map((item, index) => (
                <div key={index}>
                    <strong>{item.unit.name}</strong> at ({item.x}, {item.y}):
                    {/* Remaining stats here, similar to your provided code */}
                </div>
            ))}
        </div>
    );
}

export default BoardStats;
