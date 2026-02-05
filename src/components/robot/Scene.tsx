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
      camera={{ position: [6, 5, 8], fov: 45 }}
      gl={{ antialias: true }}
      style={{ background: '#d4cfc5' }}
    >
      {/* Lighting - warm workshop style */}
      <ambientLight intensity={0.6} />
      <directionalLight
        position={[8, 10, 5]}
        intensity={1.2}
        castShadow
        shadow-mapSize={[2048, 2048]}
      />
      <directionalLight position={[-4, 5, -3]} intensity={0.3} color="#fff5e0" />
      <pointLight position={[0, 6, 2]} intensity={0.4} color="#fffaf0" />

      {/* Environment for reflections */}
      <Environment preset="apartment" />

      {/* Floor (green table surface like in the image) */}
      <mesh position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[15, 15]} />
        <meshStandardMaterial color="#5d9a6e" roughness={0.85} />
      </mesh>

      {/* Background wall */}
      <mesh position={[0, 5, -5]} rotation={[0, 0, 0]}>
        <planeGeometry args={[20, 12]} />
        <meshStandardMaterial color="#d8d0c4" roughness={0.95} />
      </mesh>

      {/* Subtle grid on floor */}
      <Grid
        position={[0, 0.01, 0]}
        args={[15, 15]}
        cellSize={0.5}
        cellThickness={0.2}
        cellColor="#4a8a5a"
        sectionSize={2}
        sectionThickness={0.4}
        sectionColor="#3a7a4a"
        fadeDistance={20}
        fadeStrength={1}
        followCamera={false}
      />

      {/* Robot Arm */}
      <RobotArm joints={joints} />

      {/* Camera Controls */}
      <OrbitControls
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        minDistance={3}
        maxDistance={20}
        target={[0, 4, 0]}
      />
    </Canvas>
  );
};

export default Scene;
