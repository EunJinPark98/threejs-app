import React, { useState } from 'react';

const SideMenu = ({ boxes, onRenameBox }) => {
  const [editingId, setEditingId] = useState(null);
  const [inputValue, setInputValue] = useState('');

  const handleLabelClick = (box) => {
    setEditingId(box.id);
    setInputValue(box.label);
  };

  const handleChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleBlurOrEnter = (box) => {
    if (inputValue.trim() && inputValue !== box.label) {
      onRenameBox(box.id, inputValue.trim());
    }
    setEditingId(null);
  };

  return (
    <div style={{ width: '150px', background: '#eee', padding: '10px' }}>
      <h4>📦 박스 목록</h4>
      {boxes.map((box) => (
        <div key={box.id} style={{ marginBottom: '5px' }}>
          {editingId === box.id ? (
            <input
              type="text"
              value={inputValue}
              onChange={handleChange}
              onBlur={() => handleBlurOrEnter(box)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleBlurOrEnter(box);
              }}
              autoFocus
              style={{ width: '100%' }}
            />
          ) : (
            <span
              onClick={() => handleLabelClick(box)}
              style={{ cursor: 'pointer', color: '#333' }}
            >
              {box.label}
            </span>
          )}
        </div>
      ))}
    </div>
  );
};

export default SideMenu;
