import React from 'react';

const TopBar = ({ onMoveCamera }) => {
  return (
    <div style={{ height: '50px', background: '#ddd', padding: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
      <button onClick={() => onMoveCamera('left')}>⬅️</button>
      <button onClick={() => onMoveCamera('up')}>⬆️</button>
      <button onClick={() => onMoveCamera('down')}>⬇️</button>
      <button onClick={() => onMoveCamera('right')}>➡️</button>
    </div>
  );
};

export default TopBar;
