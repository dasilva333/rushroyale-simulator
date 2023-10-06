import React from 'react';
import logo from './logo.svg';
import './App.css';

import { Generic, GenericComponent } from './components/Generic.jsx';

function App() {
  // Manually defining a 3x5 board
  const board = Array(3).fill(Array(5).fill(null));

  // Adding a Generic unit
  const genericUnit = new Generic(5, 10); // Assuming a rateOfFire of 5 and damagePerHit of 10 for this example
  board[1][2] = genericUnit;  // Placing the unit at row 1, column 2

  // Calculating Total DPS
  let totalDPS = 0;
  board.forEach(row => {
    row.forEach(unit => {
      if (unit) {
        totalDPS += unit.calculateDPS();
      }
    });
  });

  return (
    <div className="App">
      <header className="App-header">
        
        {/* Display the Generic unit */}
        <GenericComponent unit={genericUnit} />
        
        <p>
          Single Generic Unit DPS: {genericUnit.calculateDPS()}
        </p>
        <p>
          Total Board DPS: {totalDPS}
        </p>
        
      </header>
    </div>
  );
}

export default App;
