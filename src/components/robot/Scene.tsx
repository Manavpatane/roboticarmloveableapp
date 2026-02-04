import { Canvas } from '@react-three/fiber';
import { OrbitControls, Grid, Environment } from '@react-three/drei';
import { RobotArm } from './RobotArm';

interface SceneProps {
  joints: {
    base: number;
    shoulder: number;
    elbow: number;
    wrist: number;
  };
}

export const Scene = ({ joints }: SceneProps) => {
  return (
    <Canvas
      camera={{ position: [6, 4, 8], fov: 50 }}
      gl={{ antialias: true }}
      style={{ background: '#e8e0d5' }}
    >
      {/* Lighting */}
      <ambientLight intensity={0.5} />
      <directionalLight
        position={[10, 10, 5]}
        intensity={1}
        castShadow
        shadow-mapSize={[2048, 2048]}
      />
      <directionalLight position={[-5, 5, -5]} intensity={0.4} />
      <pointLight position={[0, 8, 0]} intensity={0.3} />

      {/* Environment for reflections */}
      <Environment preset="apartment" />

      {/* Floor (green table surface) */}
      <mesh position={[0, -0.2, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[15, 15]} />
        <meshStandardMaterial color="#5a8a6a" roughness={0.8} />
      </mesh>

      {/* Grid on floor */}
      <Grid
        position={[0, -0.19, 0]}
        args={[15, 15]}
        cellSize={1}
        cellThickness={0.3}
        cellColor="#4a7a5a"
        sectionSize={5}
        sectionThickness={0.5}
        sectionColor="#3a6a4a"
        fadeDistance={20}
        fadeStrength={1}
        followCamera={false}
      />

      {/* Axis Helper Lines */}
      <axesHelper args={[2]} position={[0, -0.18, 0]} />

      {/* Robot Arm */}
      <RobotArm joints={joints} />

      {/* Camera Controls */}
      <OrbitControls
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        minDistance={4}
        maxDistance={20}
        target={[0, 2, 0]}
      />
    </Canvas>
  );
};

export default Scene;
