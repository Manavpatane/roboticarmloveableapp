import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface RobotArmProps {
  joints: {
    base: number;
    shoulder: number;
    elbow: number;
    wrist: number;
  };
}

// Colors matching the real robot
const WOOD_LIGHT = '#c4a574';
const WOOD_MEDIUM = '#a67c52';
const WOOD_DARK = '#8b6914';
const MOTOR_GRAY = '#5a5a5a';
const GEAR_WHITE = '#e8e8e8';
const METAL_DARK = '#3a3a3a';
const WIRE_RED = '#c41e1e';
const WIRE_BLACK = '#1a1a1a';
const SCREW_SILVER = '#888888';

export const RobotArm = ({ joints }: RobotArmProps) => {
  const baseRef = useRef<THREE.Group>(null);
  const motor1Ref = useRef<THREE.Group>(null);
  const motor2Ref = useRef<THREE.Group>(null);
  const gripperRef = useRef<THREE.Group>(null);

  useFrame(() => {
    if (baseRef.current) {
      baseRef.current.rotation.y = THREE.MathUtils.degToRad(joints.base);
    }
    if (motor1Ref.current) {
      motor1Ref.current.rotation.z = THREE.MathUtils.degToRad(joints.shoulder);
    }
    if (motor2Ref.current) {
      motor2Ref.current.rotation.z = THREE.MathUtils.degToRad(joints.elbow);
    }
    if (gripperRef.current) {
      gripperRef.current.rotation.z = THREE.MathUtils.degToRad(joints.wrist);
    }
  });

  return (
    <group>
      {/* Wooden Base Platform */}
      <mesh position={[0, 0.08, 0]}>
        <boxGeometry args={[2.2, 0.16, 0.8]} />
        <meshStandardMaterial color={WOOD_MEDIUM} roughness={0.85} />
      </mesh>
      
      {/* Base Rotation Group */}
      <group ref={baseRef}>
        {/* Main Vertical Wooden Post */}
        <mesh position={[0, 2.5, 0]}>
          <boxGeometry args={[0.28, 4.7, 0.22]} />
          <meshStandardMaterial color={WOOD_LIGHT} roughness={0.8} />
        </mesh>

        {/* Diagonal Support Brace */}
        <group position={[0.15, 0.16, 0]} rotation={[0, 0, -0.52]}>
          <mesh position={[1.8, 2.0, 0]}>
            <boxGeometry args={[0.18, 4.5, 0.12]} />
            <meshStandardMaterial color={WOOD_MEDIUM} roughness={0.8} />
          </mesh>
        </group>

        {/* Top connection block */}
        <mesh position={[0.35, 4.55, 0]}>
          <boxGeometry args={[0.5, 0.25, 0.2]} />
          <meshStandardMaterial color={WOOD_LIGHT} roughness={0.8} />
        </mesh>

        {/* Screws on vertical post */}
        <Screw position={[0.15, 4.2, 0]} />
        <Screw position={[0.15, 3.5, 0]} />
        <Screw position={[0.15, 1.2, 0]} />
        <Screw position={[0.15, 0.5, 0]} />

        {/* Upper Stepper Motor (J2 - Shoulder) */}
        <group ref={motor1Ref} position={[-0.05, 3.2, 0.2]}>
          <StepperMotor />
          {/* Gear */}
          <Gear position={[0, 0, 0.22]} rotation={joints.shoulder} />
        </group>

        {/* Lower Stepper Motor (J3 - Elbow) */}
        <group ref={motor2Ref} position={[-0.05, 1.8, 0.2]}>
          <StepperMotor />
          {/* Gear */}
          <Gear position={[0, 0, 0.22]} rotation={joints.elbow} />
        </group>

        {/* Wiring - Red wire */}
        <Wire 
          points={[
            new THREE.Vector3(-0.15, 3.2, 0.15),
            new THREE.Vector3(-0.25, 2.5, 0.15),
            new THREE.Vector3(-0.15, 1.8, 0.15),
          ]} 
          color={WIRE_RED} 
        />
        
        {/* Wiring - Black wire */}
        <Wire 
          points={[
            new THREE.Vector3(-0.2, 3.2, 0.12),
            new THREE.Vector3(-0.3, 2.5, 0.12),
            new THREE.Vector3(-0.2, 1.8, 0.12),
            new THREE.Vector3(-0.25, 0.8, 0.1),
            new THREE.Vector3(-0.1, 0.2, 0.1),
          ]} 
          color={WIRE_BLACK} 
        />

        {/* Lower red wire to gripper area */}
        <Wire 
          points={[
            new THREE.Vector3(-0.15, 1.8, 0.15),
            new THREE.Vector3(-0.2, 1.0, 0.12),
            new THREE.Vector3(-0.15, 0.4, 0.1),
          ]} 
          color={WIRE_RED} 
        />

        {/* Gripper Assembly */}
        <group ref={gripperRef} position={[0, 0.6, 0]}>
          {/* Gripper mount bracket */}
          <mesh position={[0, 0, 0]}>
            <boxGeometry args={[0.22, 0.35, 0.18]} />
            <meshStandardMaterial color={WOOD_DARK} roughness={0.75} />
          </mesh>

          {/* Metal gripper base */}
          <mesh position={[0, -0.25, 0]}>
            <boxGeometry args={[0.18, 0.2, 0.12]} />
            <meshStandardMaterial color={METAL_DARK} metalness={0.6} roughness={0.4} />
          </mesh>

          {/* Gripper bolt */}
          <mesh position={[0, 0.1, 0.1]} rotation={[Math.PI/2, 0, 0]}>
            <cylinderGeometry args={[0.03, 0.03, 0.1, 12]} />
            <meshStandardMaterial color={SCREW_SILVER} metalness={0.8} roughness={0.2} />
          </mesh>

          {/* Gripper Fingers */}
          <GripperFinger position={[0.06, -0.45, 0]} angle={0.1} />
          <GripperFinger position={[-0.06, -0.45, 0]} angle={-0.1} mirrored />
        </group>
      </group>

      {/* Cable on floor */}
      <mesh position={[0.3, 0.02, 0.35]} rotation={[Math.PI/2, 0, 0.5]}>
        <torusGeometry args={[0.25, 0.015, 8, 20, Math.PI * 1.3]} />
        <meshStandardMaterial color={WIRE_RED} roughness={0.6} />
      </mesh>
    </group>
  );
};

// Stepper Motor Component (NEMA-style)
const StepperMotor = () => {
  return (
    <group>
      {/* Motor body */}
      <mesh>
        <boxGeometry args={[0.35, 0.35, 0.28]} />
        <meshStandardMaterial color={MOTOR_GRAY} metalness={0.5} roughness={0.5} />
      </mesh>
      {/* Motor face plate */}
      <mesh position={[0, 0, 0.145]}>
        <boxGeometry args={[0.33, 0.33, 0.02]} />
        <meshStandardMaterial color="#4a4a4a" metalness={0.6} roughness={0.4} />
      </mesh>
      {/* Motor mounting holes */}
      <Screw position={[0.12, 0.12, 0.15]} small />
      <Screw position={[-0.12, 0.12, 0.15]} small />
      <Screw position={[0.12, -0.12, 0.15]} small />
      <Screw position={[-0.12, -0.12, 0.15]} small />
      {/* Motor shaft */}
      <mesh position={[0, 0, 0.18]} rotation={[Math.PI/2, 0, 0]}>
        <cylinderGeometry args={[0.025, 0.025, 0.08, 16]} />
        <meshStandardMaterial color="#888888" metalness={0.8} roughness={0.2} />
      </mesh>
    </group>
  );
};

// Gear Component
interface GearProps {
  position: [number, number, number];
  rotation: number;
}

const Gear = ({ position, rotation }: GearProps) => {
  const gearRef = useRef<THREE.Group>(null);
  
  useFrame(() => {
    if (gearRef.current) {
      gearRef.current.rotation.z = THREE.MathUtils.degToRad(rotation * 2);
    }
  });

  return (
    <group ref={gearRef} position={position}>
      {/* Gear body */}
      <mesh rotation={[Math.PI/2, 0, 0]}>
        <cylinderGeometry args={[0.12, 0.12, 0.06, 16]} />
        <meshStandardMaterial color={GEAR_WHITE} roughness={0.3} />
      </mesh>
      {/* Gear hub */}
      <mesh position={[0, 0, 0.02]} rotation={[Math.PI/2, 0, 0]}>
        <cylinderGeometry args={[0.04, 0.04, 0.04, 12]} />
        <meshStandardMaterial color="#cccccc" roughness={0.4} />
      </mesh>
      {/* Gear teeth (simplified) */}
      {Array.from({ length: 12 }).map((_, i) => {
        const angle = (i / 12) * Math.PI * 2;
        return (
          <mesh 
            key={i} 
            position={[Math.cos(angle) * 0.13, Math.sin(angle) * 0.13, 0]}
            rotation={[Math.PI/2, 0, angle]}
          >
            <boxGeometry args={[0.03, 0.04, 0.06]} />
            <meshStandardMaterial color={GEAR_WHITE} roughness={0.3} />
          </mesh>
        );
      })}
    </group>
  );
};

// Screw Component
interface ScrewProps {
  position: [number, number, number];
  small?: boolean;
}

const Screw = ({ position, small }: ScrewProps) => {
  const size = small ? 0.02 : 0.03;
  return (
    <mesh position={position} rotation={[Math.PI/2, 0, 0]}>
      <cylinderGeometry args={[size, size, small ? 0.02 : 0.04, 8]} />
      <meshStandardMaterial color={SCREW_SILVER} metalness={0.8} roughness={0.2} />
    </mesh>
  );
};

// Wire Component
interface WireProps {
  points: THREE.Vector3[];
  color: string;
}

const Wire = ({ points, color }: WireProps) => {
  const curve = new THREE.CatmullRomCurve3(points);
  
  return (
    <mesh>
      <tubeGeometry args={[curve, 20, 0.012, 8, false]} />
      <meshStandardMaterial color={color} roughness={0.6} />
    </mesh>
  );
};

// Gripper Finger Component
interface GripperFingerProps {
  position: [number, number, number];
  angle: number;
  mirrored?: boolean;
}

const GripperFinger = ({ position, angle, mirrored }: GripperFingerProps) => {
  return (
    <group position={position} rotation={[0, 0, angle]}>
      {/* Main finger segment */}
      <mesh>
        <boxGeometry args={[0.04, 0.25, 0.08]} />
        <meshStandardMaterial color={METAL_DARK} metalness={0.5} roughness={0.5} />
      </mesh>
      {/* Finger tip (angled inward) */}
      <mesh position={[mirrored ? -0.015 : 0.015, -0.15, 0]} rotation={[0, 0, mirrored ? 0.25 : -0.25]}>
        <boxGeometry args={[0.035, 0.1, 0.06]} />
        <meshStandardMaterial color="#2a2a2a" metalness={0.6} roughness={0.4} />
      </mesh>
    </group>
  );
};

export default RobotArm;