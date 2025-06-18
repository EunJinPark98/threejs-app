// RightPanel.jsx
import React from 'react';

const RightPanel = ({
  moveMode,
  deleteMode,
  connectMode,
  onStartMove,
  onStartDelete,
  onConnect,
  onAddBox,
  onSave,
  onCancel
}) => {
  const isEditing = moveMode || deleteMode || connectMode;

  return (
    <div style={{ width: '150px', background: '#eee', padding: '10px' }}>
      {!isEditing && (
        <>
          <button onClick={onStartMove} style={{ marginBottom: '5px' }}>📦 이동모드</button>
          <button onClick={onConnect} style={{ marginBottom: '5px' }}>🔗 연결모드</button>
          <button onClick={onStartDelete} style={{ marginBottom: '5px' }}>❌ 삭제모드</button>
          <button onClick={onAddBox} style={{ marginBottom: '10px' }}>➕ 박스생성</button>
        </>
      )}

      {isEditing && (
        <>
          <button onClick={onSave} style={{ marginBottom: '5px' }}>💾 저장</button>
          <button onClick={onCancel}>↩️ 취소</button>
        </>
      )}
    </div>
  );
};

export default RightPanel;
