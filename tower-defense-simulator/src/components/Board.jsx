import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addUnit, updateUnit, undoAction, redoAction, removeGlobalUnit, addGlobalUnit, updateGlobalUnit } from '../redux/actions';

import UnitSelectionModal from './UnitSelectionModal';
import UnitConfigurationModal from './UnitConfigurationModal';
import BoardConfigurationModal from './BoardConfigurationModal';
import BoardStats from './BoardStats';
import Deck from './Deck';
import GridCell from './GridCell';


import '../styles/board.scss';

function Board() {
    const dispatch = useDispatch();
    const past = useSelector(state => state.past);
    const future = useSelector(state => state.future);
    const board = useSelector(state => state.present.board);
    const globalUnits = useSelector(state => state.present.globalUnits);
    const [selectedCell, setSelectedCell] = useState(null);
    const [selectedUnit, setSelectedUnit] = useState(null);
    const [unitConfig, setUnitConfig] = useState({});
    const [cellContext, setCellContext] = useState("BoardCell");

    const [boardConfig, setBoardConfig] = useState({
        playerCrit: 2923, // default value, adjust as needed
    });

    // Modal Management
    const [showConfigModal, setShowConfigModal] = useState(false);
    const [activeModal, setActiveModal] = useState(null);
    const showSelectionModal = () => setActiveModal('selection');
    const showConfigurationModal = () => setActiveModal('configuration');
    const closeModal = () => setActiveModal(null);

    const handleBoardCellClick = (x, y) => {
        setCellContext("BoardCell");
        setSelectedCell({ x, y });
        const unit = board[x][y];

        if (unit) {
            setSelectedUnit(unit);
            setUnitConfig(unit);  // Start the configuration with current unit values
            showConfigurationModal();
        } else {
            setSelectedUnit(null);
            setUnitConfig({});
            showSelectionModal();
        }
    };

    const handleDeckCellClick = (index) => {
        setCellContext("DeckCell", index);
        setSelectedCell({ x: index });
        if (globalUnits && globalUnits[index]) {
            console.log('removing unit');
            // if there's already a unit in this slot, remove it
            dispatch(removeGlobalUnit(index));
        } else {
            console.log("showing unit selection modal");
            setSelectedUnit(null);
            setUnitConfig({});
            showSelectionModal();
        }
    };

    const handleUnitSelect = (unitInfo) => {
        setSelectedUnit(unitInfo);
        setUnitConfig({});  // Reset config when a new unit is selected
        showConfigurationModal();
    };

    const handleConfigConfirmed = () => {
        const fullUnitConfig = {
            ...unitConfig,
            name: selectedUnit.name
        };
        // console.log('cellContext', cellContext, selectedCell, fullUnitConfig);
        if (cellContext === "BoardCell") {
            if (selectedUnit) {
                dispatch(updateUnit(fullUnitConfig, selectedCell.x, selectedCell.y));
            } else {
                dispatch(addUnit(fullUnitConfig, selectedCell.x, selectedCell.y));
            }
        } else if (cellContext === "DeckCell") {
            // Handle the global units here.
            if (globalUnits[selectedCell.x]) {
                dispatch(updateGlobalUnit(fullUnitConfig, selectedCell.x));
            } else {
                dispatch(addGlobalUnit(fullUnitConfig, selectedCell.x));
            }
        }

        closeModal();
    };

    const handleConfigChange = (newConfig) => {
        setUnitConfig(prevConfig => ({ ...prevConfig, ...newConfig }));
    };

    return (
        <div className="container board">
            <div className="row">
                {/* First column */}
                <div className="col-md-6 d-flex flex-column align-items-center mt-2">
                    <div className="board-grid">
                        {board.map((row, x) => (
                            <div key={x} className="board-row">
                                {row.map((unit, y) => (
                                    <GridCell key={y} x={x} y={y} unit={unit} onSelect={handleBoardCellClick} />
                                ))}
                            </div>
                        ))}
                    </div>
                    
                    <Deck globalUnits={globalUnits} onSelect={handleDeckCellClick} />

                    <div className="btn-group mt-2 mb-2" role="group" aria-label="Board actions">
                        <button className="btn btn-primary" onClick={() => dispatch(undoAction())} disabled={past.length === 0}>Undo</button>
                        <button className="btn btn-primary" onClick={() => dispatch(redoAction())} disabled={future.length === 0}>Redo</button>
                        <button className="btn btn-secondary" onClick={() => setShowConfigModal(true)}>Configure Board</button>
                    </div>
                </div>

                {/* Second column */}
                <div className="col-md-6">
                    <BoardStats boardConfig={boardConfig} />
                </div>
            </div>

            {showConfigModal && (
                <BoardConfigurationModal
                    boardConfig={boardConfig}
                    onConfigChange={newConfig => setBoardConfig(newConfig)}
                    onClose={() => setShowConfigModal(false)}
                />
            )}
            {activeModal === 'selection' && <UnitSelectionModal cellContext={cellContext} onSelect={handleUnitSelect} onClose={closeModal} globalUnits={globalUnits} />}
            {activeModal === 'configuration' && (
                <UnitConfigurationModal
                    unit={selectedUnit}
                    unitConfig={unitConfig}
                    onConfirm={handleConfigConfirmed}
                    onConfigChange={handleConfigChange}
                />
            )}
        </div>
    );
}

export default Board;
