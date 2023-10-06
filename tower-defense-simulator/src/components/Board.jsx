import React, { useState } from 'react';
import { availableUnits } from '../data/unitData';
import '../styles/board.scss';

function GridCell({ x, y, unit, onSelect }) {
    const UnitComponent = unit?.component;
    return (
        <div className="grid-cell" onClick={() => onSelect(x, y)}>
            {UnitComponent && <UnitComponent unit={unit} />}
        </div>
    );
}


function UnitSelectionModal({ onSelect, onClose }) {
    console.log(availableUnits);
    return (
        <div className="unit-selection-modal">
            <ul>
                {availableUnits.map((unit, index) => (
                    <li key={index} onClick={() => { onSelect(unit); onClose(); }}>
                        <img src={unit.class.baseImage} alt={unit.name} width="60" />
                    </li>
                ))}
            </ul>
        </div>
    );
}


function BoardStats({ board }) {
    const totalDPS = board.flat().reduce((acc, unit) => acc + (unit ? unit.calculateDPS() : 0), 0);
    const unitDetails = board.flatMap((row, x) => 
        row.map((unit, y) => unit ? ({ unit, x, y }) : null)
    ).filter(item => item);

    return (
        <div className="board-stats">
            <p>Total DPS: {totalDPS}</p>
            <ul>
                {unitDetails.map((item, index) => (
                    <li key={index}>
                        {item.unit.name} at ({item.x}, {item.y}): {item.unit.calculateDPS()} DPS
                    </li>
                ))}
            </ul>
        </div>
    );
}

function Board() {
    const initialBoardState = [...Array(3)].map(() => Array(5).fill(null));
    const [board, setBoard] = useState(initialBoardState);
    const [showModal, setShowModal] = useState(false);
    const [selectedCell, setSelectedCell] = useState(null);

    const handleCellClick = (x, y) => {
        // console.log(`handleCellClick (${x}, ${y})`);
        setShowModal(true);
        setSelectedCell({ x, y });
    };

    const handleUnitSelect = (unitInfo) => {
        const newBoard = [...board];
        const unitInstance = new unitInfo.class(5, 10); // Example rateOfFire and damagePerHit
        newBoard[selectedCell.x][selectedCell.y] = unitInstance;
        // console.log('handleUnitSelect', selectedCell);
        setBoard(newBoard);
        setShowModal(false);
    };

    return (
        <div className="board">
            {board.map((row, x) => (
                <div key={x} className="board-row">
                    {row.map((unit, y) => (
                        <GridCell key={y} x={x} y={y} unit={unit} onSelect={handleCellClick} />
                    ))}
                </div>
            ))}
            <BoardStats board={board} />
            {showModal && <UnitSelectionModal onSelect={handleUnitSelect} onClose={() => setShowModal(false)} />}
        </div>
    );
}

export default Board;
