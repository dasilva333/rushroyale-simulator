import React from 'react';

function PhaseLength({ dpsInfo }) {
  if (!dpsInfo.totalPhaseLengthSeconds || dpsInfo.totalPhaseLengthSeconds <= 0) return null;
  
  return (
    <div>
      <strong>Phase Length:</strong> {dpsInfo.totalPhaseLengthSeconds}s
    </div>
  );
}

export default PhaseLength;
