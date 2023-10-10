// BoardConfigurationModal.jsx
import React from 'react';


function BoardConfigurationModal({ boardConfig, onConfigChange, onClose }) {
  const handlePlayerCritChange = (e) => {
    const newConfig = { ...boardConfig, playerCrit: parseFloat(e.target.value) };
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
      {/* Add more configuration options as needed */}
      <button onClick={onClose}>Close</button>
    </div>
  );
}

export default BoardConfigurationModal;
