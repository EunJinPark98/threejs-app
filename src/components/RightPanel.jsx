// RightPanel.jsx
import React from 'react';

const RightPanel = ({ moveMode, deleteMode, onStartMove, onStartDelete, onAddBox, onSave, onCancel }) => {
  return (
    <div style={{ width: '150px', background: '#eee', padding: '10px' }}>
      {!moveMode && !deleteMode && (
        <>
          <button onClick={onStartMove} style={{ marginBottom: '5px' }}>이동모드</button>
          <button onClick={onStartDelete} style={{ marginBottom: '5px' }}>삭제모드</button>
          <button onClick={onAddBox} style={{ marginBottom: '10px' }}>박스 생성</button>
        </>
      )}
      {(moveMode || deleteMode) && (
        <>
          <button onClick={onSave} style={{ marginBottom: '5px' }}>저장</button>
          <button onClick={onCancel}>취소</button>
        </>
      )}
    </div>
  );
};

export default RightPanel;