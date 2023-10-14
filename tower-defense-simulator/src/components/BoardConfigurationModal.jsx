// BoardConfigurationModal.jsx
import React from 'react';


function BoardConfigurationModal({ boardConfig, onConfigChange, onClose }) {
  const handlePlayerCritChange = (e) => {
    const newConfig = { ...boardConfig, playerCrit: parseFloat(e.target.value) };
    onConfigChange(newConfig);
  };

  const handleWaveIndexChange = (e) => {
    const newConfig = { ...boardConfig, waveIndex: parseInt(e.target.value, 10) };
    onConfigChange(newConfig);
  };

  return (
    <div className="board-configuration-modal">
      <label>
        Player Crit:
        <input 
          type="number" 
          value={boardConfig.playerCrit}
          onChange={handlePlayerCritChange}
        />
      </label>
      <label>
        Wave Index:
        <input 
          type="number" 
          value={boardConfig.waveIndex || 0}
          onChange={handleWaveIndexChange}
        />
      </label>
      {/* Add more configuration options as needed */}
      <button onClick={onClose}>Close</button>
    </div>
  );
}

export default BoardConfigurationModal;
