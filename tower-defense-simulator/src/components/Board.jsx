import React, { useState } from 'react';
import UnitSelectionModal from './UnitSelectionModal';
import UnitConfigurationModal from './UnitConfigurationModal';
import useModalSequence from '../hooks/useModalSequence';
import { useSelector, useDispatch } from 'react-redux';
import { addUnit, undoAction, redoAction } from '../redux/actions';
import BoardConfigurationModal from './BoardConfigurationModal';
import { rehydrateUnit } from '../utils/unitUtilities';
import BoardStats from './BoardStats';

import '../styles/board.scss';

function GridCell({ x, y, unit, onSelect }) {
    const UnitComponent = unit && rehydrateUnit(unit).component;
    return (
        <div className="grid-cell" onClick={() => onSelect(x, y)}>
            {UnitComponent && <UnitComponent unit={unit} />}
        </div>
    );
}

function Board() {
    const dispatch = useDispatch();
    const past = useSelector(state => state.past);
    const future = useSelector(state => state.future);
    const board = useSelector(state => state.present.board);
    const [selectedCell, setSelectedCell] = useState(null);
    const [selectedUnit, setSelectedUnit] = useState(null); // Holds the unitInfo or name for now
    const [unitConfig, setUnitConfig] = useState({}); // Configuration for the unit instance
    const [boardConfig, setBoardConfig] = useState({
        playerCrit: 2923, // default value, adjust as needed
        // ... other settings
    });
    const [showConfigModal, setShowConfigModal] = useState(false);

    const {
        activeModal,
        showSelectionModal,
        showConfigurationModal,
        closeModal
    } = useModalSequence();

    const handleCellClick = (x, y) => {
        const unit = board[x][y];
        setSelectedCell({ x, y });

        if (unit) {
            setSelectedUnit(unit);
            showConfigurationModal();
        } else {
            showSelectionModal();
        }
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
            <button onClick={() => dispatch(undoAction())} disabled={past.length === 0}>Undo</button>
            <button onClick={() => dispatch(redoAction())} disabled={future.length === 0}>Redo</button>

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
