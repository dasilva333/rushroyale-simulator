import React, { useState, useEffect } from 'react';
import UnitSelectionModal from './UnitSelectionModal';
import UnitConfigurationModal from './UnitConfigurationModal';
import useModalSequence from '../hooks/useModalSequence';
import { useSelector, useDispatch } from 'react-redux';
import { addUnit, setBoard } from '../redux/actions';
import BoardConfigurationModal from './BoardConfigurationModal';
import { rehydrateUnit } from '../utils/unitUtilities';

import '../styles/board.scss';

function GridCell({ x, y, unit, onSelect }) {
    const UnitComponent = unit?.component;
    return (
        <div className="grid-cell" onClick={() => onSelect(x, y)}>
            {UnitComponent && <UnitComponent unit={unit} />}
        </div>
    );
}

function BoardStats({ boardConfig }) {
    const board = useSelector(state => state.board);

    const dpsDetails = board.flatMap((row, x) =>
        row.map((unit, y) => {
            if (!unit) return null;

            // Rehydrate the unit
            const UnitInstance = rehydrateUnit(unit);
            const dps = UnitInstance.calculateDPS(boardConfig).total;

            return { unit: UnitInstance, dps, x, y };
        })
    ).filter(item => item);

    const totalDPS = dpsDetails.reduce((acc, unit) => acc + unit.dps, 0);

    return (
        <div className="board-stats">
            <p>Total DPS: {totalDPS}</p>
            <ul>
                {dpsDetails.map((item, index) => (
                    <li key={index}>
                        {item.unit.name} at ({item.x}, {item.y}): {item.dps} DPS
                    </li>
                ))}
            </ul>
        </div>
    );
}

function Board() {
    const dispatch = useDispatch();
    const board = useSelector(state => state.board);
    const [selectedCell, setSelectedCell] = useState(null);
    const [selectedUnit, setSelectedUnit] = useState(null); // Holds the unitInfo or name for now
    const [unitConfig, setUnitConfig] = useState({}); // Configuration for the unit instance
    const [boardConfig, setBoardConfig] = useState({
        playerCrit: 3000, // default value, adjust as needed
        // ... other settings
    });
    const [showConfigModal, setShowConfigModal] = useState(false);

    useEffect(() => {
        const initialBoardState = [...Array(3)].map(() => Array(5).fill(null));
        dispatch(setBoard(initialBoardState));
    }, [dispatch]);

    const {
        activeModal,
        showSelectionModal,
        showConfigurationModal,
        closeModal
    } = useModalSequence();

    const handleCellClick = (x, y) => {
        showSelectionModal();
        setSelectedCell({ x, y });
    };

    const handleUnitSelect = (unitInfo) => {
        setSelectedUnit(unitInfo); // Just set the unitInfo
        showConfigurationModal();
    };

    const handleConfigConfirmed = () => {
        const configWithName = {
            ...unitConfig,
            name: selectedUnit.name
        };
        dispatch(addUnit(configWithName, selectedCell.x, selectedCell.y));
        closeModal();
    };

    const handleConfigChange = (newConfig) => {
        // Update the unitConfig with newConfig (from the modal)
        setUnitConfig(currentConfig => ({ ...currentConfig, ...newConfig }));
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
            <button onClick={() => setShowConfigModal(true)}>Configure Board</button>
            {showConfigModal && (
                <BoardConfigurationModal
                    boardConfig={boardConfig}
                    onConfigChange={newConfig => setBoardConfig(newConfig)}
                    onClose={() => setShowConfigModal(false)}
                />
            )}

            <BoardStats boardConfig={boardConfig} />
            {activeModal === 'selection' && <UnitSelectionModal onSelect={handleUnitSelect} onClose={closeModal} />}
            {activeModal === 'configuration' && (
                <UnitConfigurationModal
                    unit={selectedUnit}
                    onConfirm={handleConfigConfirmed}
                    onConfigChange={handleConfigChange}
                />
            )}
        </div>
    );
}

export default Board;
