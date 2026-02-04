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
      camera={{ position: [8, 5, 8], fov: 50 }}
      gl={{ antialias: true }}
      style={{ background: '#3a3a3a' }}
    >
      {/* Lighting */}
      <ambientLight intensity={0.4} />
      <directionalLight
        position={[10, 10, 5]}
        intensity={1}
        castShadow
        shadow-mapSize={[2048, 2048]}
      />
      <directionalLight position={[-5, 5, -5]} intensity={0.5} />
      <pointLight position={[0, 10, 0]} intensity={0.3} />

      {/* Environment for reflections */}
      <Environment preset="warehouse" />

      {/* Grid Floor */}
      <Grid
        position={[0, -0.3, 0]}
        args={[20, 20]}
        cellSize={1}
        cellThickness={0.5}
        cellColor="#555555"
        sectionSize={5}
        sectionThickness={1}
        sectionColor="#666666"
        fadeDistance={30}
        fadeStrength={1}
        followCamera={false}
      />

      {/* Axis Helper Lines */}
      <axesHelper args={[3]} position={[0, -0.29, 0]} />

      {/* Robot Arm */}
      <RobotArm joints={joints} />

      {/* Camera Controls */}
      <OrbitControls
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        minDistance={5}
        maxDistance={20}
        target={[2, 2, 0]}
      />
    </Canvas>
  );
};

export default Scene;
