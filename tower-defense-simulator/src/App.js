import React from 'react';
import logo from './logo.svg';
import './App.css';
import Board from './components/Board.jsx';

function App() {
    return (
        <div className="App">
            <header className="App-header">

                <h2>RushRoyale Simulator</h2>

                <Board />
                 
            </header>
        </div>
    );
}

export default App;
