// App.jsx
import React, { useState, useEffect } from 'react';
import './App.css';
import TopBar from './components/TopBar';
import SideMenu from './components/SideMenu';
import RightPanel from './components/RightPanel';
import CanvasView from './components/CanvasView';

const defaultBoxes = [
  { id: 'a', position: [-2, 0, 0], label: 'T_STL_A' },
  { id: 'b', position: [0, 0, 0], label: 'T_STL_B' },
  { id: 'c', position: [2, 0, 0], label: 'T_STL_C' }
];

function App() {
  const [boxes, setBoxes] = useState([]);
  const [originalBoxes, setOriginalBoxes] = useState([]);
  const [moveMode, setMoveMode] = useState(false);
  const [deleteMode, setDeleteMode] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('boxes');
    if (saved) {
      setBoxes(JSON.parse(saved));
    } else {
      setBoxes(defaultBoxes);
    }
  }, []);

  const handleStartMove = () => {
    setOriginalBoxes(JSON.parse(JSON.stringify(boxes)));
    setMoveMode(true);
    setDeleteMode(false);
  };

  const handleStartDelete = () => {
    setOriginalBoxes(JSON.parse(JSON.stringify(boxes)));
    setDeleteMode(true);
    setMoveMode(false);
  };

  const handleSave = () => {
    localStorage.setItem('boxes', JSON.stringify(boxes));
    setMoveMode(false);
    setDeleteMode(false);
  };

  const handleCancel = () => {
    setBoxes(originalBoxes);
    setMoveMode(false);
    setDeleteMode(false);
  };

  const handleAddBox = () => {
    const spacing = 2.5;
    const maxX = boxes.reduce((max, box) => Math.max(max, box.position[0]), 0);
    const newBox = {
      id: Date.now().toString(),
      position: [maxX + spacing, 0, 0],
      label: `T_STL_${boxes.length + 1}`
    };
    setOriginalBoxes(JSON.parse(JSON.stringify(boxes)));
    setBoxes([...boxes, newBox]);
    setMoveMode(true);
    setDeleteMode(false);
  };

  return (
    <div className="app">
      <TopBar />
      <div className="main">
        <SideMenu />
        <CanvasView
          boxes={boxes}
          setBoxes={setBoxes}
          moveMode={moveMode}
          deleteMode={deleteMode}
          orbitEnabled={!moveMode} // ⛔ 이동모드일 때 OrbitControls 비활성화
        />
        <RightPanel
          moveMode={moveMode}
          deleteMode={deleteMode}
          onStartMove={handleStartMove}
          onStartDelete={handleStartDelete}
          onAddBox={handleAddBox}
          onSave={handleSave}
          onCancel={handleCancel}
        />
      </div>
      {(moveMode || deleteMode) && (
        <div className="mask-overlay">
          <div className="mask-text">
            {moveMode && '📦 박스를 드래그해서 이동 후 저장 또는 취소하세요'}
            {deleteMode && '❌ 삭제할 박스를 클릭하세요'}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;