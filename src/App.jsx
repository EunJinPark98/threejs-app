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
  const [originalConnections, setOriginalConnections] = useState([]);
  const [moveMode, setMoveMode] = useState(false);
  const [deleteMode, setDeleteMode] = useState(false);
  const [connectMode, setConnectMode] = useState(false);

  const [connections, setConnections] = useState([]);
  const [selectedBoxes, setSelectedBoxes] = useState([]);

  useEffect(() => {
    const savedBoxes = localStorage.getItem('boxes');
    const savedConnections = localStorage.getItem('connections');

    if (savedBoxes) {
      setBoxes(JSON.parse(savedBoxes));
    } else {
      setBoxes(defaultBoxes);
    }

    if (savedConnections) {
      setConnections(JSON.parse(savedConnections));
    }
  }, []);

  const handleStartMove = () => {
    setOriginalBoxes(JSON.parse(JSON.stringify(boxes)));
     setOriginalConnections(JSON.parse(JSON.stringify(connections)));
    setMoveMode(true);
    setDeleteMode(false);
    setConnectMode(false);
  };

  const handleStartDelete = () => {
    setOriginalBoxes(JSON.parse(JSON.stringify(boxes)));
     setOriginalConnections(JSON.parse(JSON.stringify(connections)));
    setDeleteMode(true);
    setMoveMode(false);
    setConnectMode(false);
  };

  const handleAddConnect = () => {
    setConnectMode(true);
    setOriginalBoxes(JSON.parse(JSON.stringify(boxes)));
    setMoveMode(false);
    setDeleteMode(false);
    setSelectedBoxes([]);
  };

  const handleSave = () => {
    localStorage.setItem('boxes', JSON.stringify(boxes));
    localStorage.setItem('connections', JSON.stringify(connections));
    setMoveMode(false);
    setDeleteMode(false);
    setConnectMode(false);
    setSelectedBoxes([]);
  };

  const handleCancel = () => {
    setBoxes(originalBoxes);
    setConnections(originalConnections);
    setMoveMode(false);
    setDeleteMode(false);
    setConnectMode(false);
    setSelectedBoxes([]);
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
    localStorage.setItem('connections', JSON.stringify(connections));
    setBoxes([...boxes, newBox]);
    setMoveMode(true);
    setDeleteMode(false);
    setConnectMode(false);
  };

  const handleBoxClick = (id) => {
    if (!connectMode) return;

    setSelectedBoxes((prev) => {
      if (prev.includes(id)) return prev;
      const newSelection = [...prev, id];

      if (newSelection.length === 2) {
        setTimeout(() => {
          setConnections((prevConns) => [...prevConns, [newSelection[0], newSelection[1]]]);
          setSelectedBoxes([]);
        }, 300); // 빨간색 잠깐 보여주기
      }

      return newSelection;
    });
  };

  const handleRenameBox = (id, newLabel) => {
  const updatedBoxes = boxes.map((box) =>
    box.id === id ? { ...box, label: newLabel } : box
  );
  setBoxes(updatedBoxes);
  localStorage.setItem('boxes', JSON.stringify(updatedBoxes));
};

  //TopBar.jsx 카메라 무빙
  const [cameraDirection, setCameraDirection] = useState(null);

  const handleMoveCamera = (dir) => {
    setCameraDirection(dir);
  };

  return (
    <div className="app">
      <TopBar onMoveCamera={handleMoveCamera}/>
      <div className="main">
        <SideMenu
          boxes={boxes}
          onRenameBox={handleRenameBox} />
        <CanvasView
          boxes={boxes}
          setBoxes={setBoxes}
          moveMode={moveMode}
          deleteMode={deleteMode}
          orbitEnabled={!moveMode}
          connectMode={connectMode}
          onBoxClick={handleBoxClick}
          connections={connections}
          selectedBoxes={selectedBoxes}
          cameraDirection={cameraDirection}
          setCameraDirection={setCameraDirection}
        />
        <RightPanel
          moveMode={moveMode}
          deleteMode={deleteMode}
          connectMode={connectMode}
          onStartMove={handleStartMove}
          onConnect={handleAddConnect}
          onStartDelete={handleStartDelete}
          onAddBox={handleAddBox}
          onSave={handleSave}
          onCancel={handleCancel}
        />
      </div>

      {(moveMode || deleteMode || connectMode) && (
        <div className="mask-overlay">
          <div className="mask-text">
            {moveMode && '📦 박스를 드래그해서 이동 후 저장 또는 취소하세요'}
            {deleteMode && '❌ 삭제할 박스를 클릭하세요'}
            {connectMode && '🔗 연결할 박스 2개를 클릭하세요'}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
