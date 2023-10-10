import React from 'react';
import { availableUnits } from '../utils/unitUtilities';
import { Modal, Button, Row, Col } from 'react-bootstrap';
import '../styles/unit-selection-modal.scss';

function UnitSelectionModal({ onSelect, onClose, globalUnits, cellContext }) {
    let unitsToShow = availableUnits;

    if (cellContext === "DeckCell") {
        const namesInGlobalUnits = globalUnits.filter(Boolean).map(unit => unit.name);
        unitsToShow = availableUnits.filter(unit => !namesInGlobalUnits.includes(unit.name));
    } else if (cellContext === "BoardCell" && globalUnits.length === 5) {
        const namesInGlobalUnits = globalUnits.filter(Boolean).map(unit => unit.name);
        unitsToShow = availableUnits.filter(unit => namesInGlobalUnits.includes(unit.name));
    }

    return (
        <Modal show={true} onHide={onClose} centered className="unit-selection-modal">
            <Modal.Header>
                <Button onClick={onClose} className="mr-auto">Cancel</Button>
                <Button className="ml-2">Clear</Button>
                <Modal.Title className="mx-auto">Pick Card</Modal.Title>
            </Modal.Header>
            <Modal.Body className="container-fluid d-flex flex-column align-items-center">
                <Row className="w-100 justify-content-center">
                    {unitsToShow.map((unit, index) => (
                        <Col key={index} xs={4} className="text-center unit-card">
                            <img
                                src={unit.class.baseImage}
                                alt={unit.name}
                                onClick={() => { onSelect(unit); }}
                                className="responsive-img"
                            />
                        </Col>
                    ))}
                </Row>
            </Modal.Body>
        </Modal>
    );
}

export default UnitSelectionModal;
