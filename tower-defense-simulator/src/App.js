import React from 'react';
import { Provider } from 'react-redux';
import store from './redux/store';  // adjust the path if needed
import './App.css';
import Board from './components/Board.jsx';

function App() {
    return (
        <Provider store={store}>
            <div className="App">
                <header className="App-header">
                    <h2>RushRoyale Simulator</h2>
                    <Board />
                </header>
            </div>
        </Provider>
    );
}

export default App;
