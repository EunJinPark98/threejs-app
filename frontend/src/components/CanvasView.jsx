import React, { useRef, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Edges, Text, TransformControls } from '@react-three/drei';
import * as THREE from 'three';

const DraggableBox = ({ box, onChangePosition, onDelete, moveMode, deleteMode, onClick, isSelected }) => {
  const meshRef = useRef();
  const transformRef = useRef();
  const { camera, gl } = useThree();

  useEffect(() => {
    if (moveMode && transformRef.current && meshRef.current) {
      transformRef.current.attach(meshRef.current);
    }
  }, [moveMode]);

  useFrame(() => {
    if (moveMode && meshRef.current) {
      const pos = meshRef.current.position.toArray();
      onChangePosition(box.id, pos);
    }
  });

  return (
    <>
      {moveMode && (
        <TransformControls
          ref={transformRef}
          object={meshRef.current}
          mode="translate"
          showX showY={false} showZ
          camera={camera}
          domElement={gl.domElement}
        />
      )}

      <mesh
        ref={meshRef}
        position={box.position}
        onClick={(e) => {
          e.stopPropagation();
          if (deleteMode) {
            onDelete(box.id);
          } else if (onClick) {
            onClick(box.id);
          }
        }}
      >
        <boxGeometry args={[1.5, 0.3, 1.2]} />
        <meshBasicMaterial color={isSelected ? 'red' : '#ffffff'} />
        <Edges scale={1.01} threshold={15} color="black" />
      </mesh>

      <Text
        position={[box.position[0], box.position[1] + 0.16, box.position[2]]}
        rotation={[-Math.PI / 2, 0, 0]}
        fontSize={0.2}
        color="black"
        anchorX="center"
        anchorY="bottom"
      >
        {box.label}
      </Text>
    </>
  );
};

//연결바
const ConnectingBar = ({ start, end, onDelete }) => {
  const startVec = new THREE.Vector3(...start);
  const endVec = new THREE.Vector3(...end);
  const mid = new THREE.Vector3().addVectors(startVec, endVec).multiplyScalar(0.5);
  const direction = new THREE.Vector3().subVectors(endVec, startVec);
  const length = direction.length();
  const quaternion = new THREE.Quaternion().setFromUnitVectors(
    new THREE.Vector3(0, 1, 0),
    direction.clone().normalize()
  );

  return (
    <mesh 
      position={mid}
      quaternion={quaternion}
      onClick={(e) => {
        e.stopPropagation();
        if (onDelete) onDelete(); // 연결바 삭제 요청
      }}
    >
      <cylinderGeometry args={[0.1, 0.1, length, 16]} />
      <meshBasicMaterial color="black" transparent opacity={0.2} />
    </mesh>
  );
};

const FlowingCircles = ({ start, end, count = 5, speed = 0.01 }) => {
  const groupRef = useRef();
  const positions = Array.from({ length: count }).map((_, i) =>
    new THREE.Vector3().fromArray(start).lerp(new THREE.Vector3().fromArray(end), (i + 1) / (count + 1))
  );
  const spheres = useRef(positions.map((pos) => pos.clone()));

  useFrame(() => {
    const startVec = new THREE.Vector3(...start);
    const endVec = new THREE.Vector3(...end);
    const dir = new THREE.Vector3().subVectors(endVec, startVec).normalize();
    const length = startVec.distanceTo(endVec);

    spheres.current.forEach((sphere) => {
      sphere.addScaledVector(dir, speed);
      if (startVec.distanceTo(sphere) > length) {
        sphere.copy(startVec);
      }
    });

    if (groupRef.current) {
      groupRef.current.children.forEach((mesh, idx) => {
        mesh.position.copy(spheres.current[idx]);
      });
    }
  });

  return (
    <group ref={groupRef}>
      {spheres.current.map((pos, i) => (
        <mesh key={i} position={pos}>
          <sphereGeometry args={[0.08, 16, 16]} />
          <meshBasicMaterial color="yellow" />
        </mesh>
      ))}
    </group>
  );
};

//4개의 판대기
const VerticalStack = ({ basePosition, labels = ["", "", "", ""], onEdit, boxId }) => (
  <>
    {Array.from({ length: 5 }).map((_, i) => {
      const yOffset = -0.4 - i * 0.505;
      const pos = [basePosition[0], basePosition[1] + yOffset, basePosition[2]];
      return (
        <group key={i} position={pos}>
          <mesh
            onDoubleClick={(e) => {
              e.stopPropagation();
              onEdit(boxId, i);
            }}
          >
            <boxGeometry args={[1, 0.5, 0.3]} />
            <meshBasicMaterial color="#ffffff" />
            <Edges scale={1.01} threshold={15} color="black" />
          </mesh>
          {labels[i] && (
            <Text
              position={[0, 0, 0.2]}
              fontSize={0.08}
              color="black"
              anchorX="center"
              anchorY="middle"
            >
              {labels[i]}
            </Text>
          )}
        </group>
      );
    })}
  </>
);



const CanvasView = ({
  boxes,
  setBoxes,
  moveMode,
  deleteMode,
  orbitEnabled,
  connectMode,
  onBoxClick,
  connections,
  selectedBoxes,
  setConnections,
  handleUpdateStackLabel
}) => {
  const handleChangePosition = (id, newPosition) => {
    setBoxes((prev) =>
      prev.map((box) =>
        box.id === id ? { ...box, position: newPosition } : box
      )
    );
  };

  const handleDelete = (id) => {
    setBoxes((prev) => prev.filter((box) => box.id !== id));
  };

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <Canvas camera={{ position: [5, 5, 5], fov: 50 }}>
        <ambientLight intensity={1.2} />
        <directionalLight position={[5, 10, 5]} intensity={1} />
        <pointLight position={[10, 10, 10]} intensity={0.5} />

        {/* 박스 + 스택 */}
        {boxes.map((box) => (
          <React.Fragment key={box.id}>
            <DraggableBox
              box={box}
              moveMode={moveMode}
              deleteMode={deleteMode}
              onChangePosition={handleChangePosition}
              onDelete={handleDelete}
              onClick={onBoxClick}
              isSelected={selectedBoxes.includes(box.id)}
            />
            <VerticalStack 
              basePosition={box.position} 
              boxId={box.id}
              labels={box.stackLabels || ["", "", "", ""]}
              onEdit={(boxId, index) => {
                const box = boxes.find(b => b.id === boxId);
                const prev = box?.stackLabels?.[index] || "";  // ✅ 정확한 기본값
                const newText = prompt("텍스트를 입력하세요", prev);
                if (newText != null) {
                  handleUpdateStackLabel(boxId, index, newText);
                }
              }}
            />
          </React.Fragment>
        ))}

        {/* 연결된 박스들 */}
        {connections.map(([id1, id2], idx) => {
          const startBox = boxes.find((b) => b.id === id1);
          const endBox = boxes.find((b) => b.id === id2);
          if (!startBox || !endBox) return null;

          const handleDeleteConnection = () => {
            if (!deleteMode) return;
            setConnections((prev) =>
              prev.filter(([a, b]) => !(a === id1 && b === id2))
            );
          };

          return (
            <React.Fragment key={idx}>
              <ConnectingBar start={startBox.position} end={endBox.position} onDelete={handleDeleteConnection}/>
              <FlowingCircles start={startBox.position} end={endBox.position} />
            </React.Fragment>
          );
        })}

        <OrbitControls enabled={orbitEnabled} />
      </Canvas>
    </div>
  );
};

export default CanvasView;
