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
                    <div>Base Damage: {item.dpsInfo.newAttackDamage.toLocaleString()}</div>
                    <div>Attack Speed: {item.dpsInfo.newAttackSpeed} / s</div>
                    <div>DPS: {item.dpsInfo.dmgPerSecond.toLocaleString()} / s</div>
                    <div>Crit. Damage: {item.dpsInfo.criticalDamage.toLocaleString()} / hit</div>
                    <div>Crit. Hits: {item.dpsInfo.critHitsPerSecond.toLocaleString()} / s ({item.dpsInfo.totalCritChance * 100}%)</div>
                    <div>Crit. DPS: {item.dpsInfo.critDmgPerSecond.toLocaleString()} / s</div>
                    {item.unit.statsComponent && React.createElement(item.unit.statsComponent, { dpsInfo: item.dpsInfo })}
                </div>
            ))}
        </div>
    );
}

export default BoardStats;
