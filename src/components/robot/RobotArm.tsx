import { useRef, useMemo } from 'react';
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

// Colors for wooden DIY robot
const WOOD_LIGHT = '#d4a574';
const WOOD_MEDIUM = '#b8956a';
const WOOD_DARK = '#8b7355';
const SERVO_BLUE = '#1e4a8a';
const SERVO_BLACK = '#2a2a2a';
const METAL_SILVER = '#a8a8a8';
const SCREW_GOLD = '#c9a227';

// Link lengths scaled x10 for visualization (from DH params)
const L1 = 0.5;   // base height (5cm -> 0.5 units)
const L2 = 3.0;   // shoulder to elbow (30cm -> 3 units)
const L3 = 3.5;   // elbow to wrist (35cm -> 3.5 units)

export const RobotArm = ({ joints }: RobotArmProps) => {
  const baseRef = useRef<THREE.Group>(null);
  const shoulderRef = useRef<THREE.Group>(null);
  const elbowRef = useRef<THREE.Group>(null);
  const wristRef = useRef<THREE.Group>(null);

  useFrame(() => {
    if (baseRef.current) {
      baseRef.current.rotation.y = THREE.MathUtils.degToRad(joints.base);
    }
    if (shoulderRef.current) {
      shoulderRef.current.rotation.z = THREE.MathUtils.degToRad(joints.shoulder - 90);
    }
    if (elbowRef.current) {
      elbowRef.current.rotation.z = THREE.MathUtils.degToRad(joints.elbow);
    }
    if (wristRef.current) {
      wristRef.current.rotation.z = THREE.MathUtils.degToRad(joints.wrist);
    }
  });

  return (
    <group>
      {/* ============ BASE PLATFORM ============ */}
      {/* Wooden base plate */}
      <mesh position={[0, 0.1, 0]}>
        <boxGeometry args={[2.5, 0.2, 2.5]} />
        <meshStandardMaterial color={WOOD_MEDIUM} roughness={0.85} />
      </mesh>
      
      {/* Corner supports */}
      {[[-1, -1], [-1, 1], [1, -1], [1, 1]].map(([x, z], i) => (
        <mesh key={i} position={[x * 1.0, 0.35, z * 1.0]}>
          <cylinderGeometry args={[0.08, 0.1, 0.3, 8]} />
          <meshStandardMaterial color={WOOD_DARK} roughness={0.8} />
        </mesh>
      ))}

      {/* Base servo housing */}
      <mesh position={[0, 0.35, 0]}>
        <cylinderGeometry args={[0.5, 0.6, 0.3, 16]} />
        <meshStandardMaterial color={WOOD_LIGHT} roughness={0.75} />
      </mesh>

      {/* Base servo motor (visible) */}
      <ServoMotor position={[0, 0.6, 0]} rotation={[0, 0, 0]} horizontal />
      
      {/* ============ BASE ROTATION GROUP ============ */}
      <group ref={baseRef}>
        {/* Rotating platform */}
        <mesh position={[0, 0.85, 0]}>
          <cylinderGeometry args={[0.45, 0.45, 0.15, 16]} />
          <meshStandardMaterial color={WOOD_LIGHT} roughness={0.8} />
        </mesh>

        {/* Vertical support post */}
        <mesh position={[0, 1.1, 0]}>
          <boxGeometry args={[0.35, 0.35, 0.35]} />
          <meshStandardMaterial color={WOOD_MEDIUM} roughness={0.8} />
        </mesh>

        {/* Shoulder servo mount bracket */}
        <mesh position={[0, 1.35, 0]}>
          <boxGeometry args={[0.5, 0.15, 0.5]} />
          <meshStandardMaterial color={WOOD_DARK} roughness={0.75} />
        </mesh>

        {/* Shoulder servo (J2) - visible */}
        <ServoMotor position={[0, 1.5, 0.25]} rotation={[Math.PI/2, 0, 0]} />
        <ServoMotor position={[0, 1.5, -0.25]} rotation={[Math.PI/2, 0, 0]} />

        {/* ============ SHOULDER ROTATION GROUP ============ */}
        <group ref={shoulderRef} position={[0, 1.5, 0]}>
          {/* Upper arm link (L2 = 3.0 units) */}
          <WoodenLink length={L2} />
          
          {/* Screws on upper arm */}
          <Screw position={[0.18, 0.3, 0]} />
          <Screw position={[0.18, L2 - 0.3, 0]} />

          {/* ============ ELBOW JOINT ============ */}
          <group position={[0, L2, 0]}>
            {/* Elbow joint block */}
            <mesh>
              <boxGeometry args={[0.45, 0.35, 0.45]} />
              <meshStandardMaterial color={WOOD_LIGHT} roughness={0.8} />
            </mesh>

            {/* Elbow servo (J3) - visible */}
            <ServoMotor position={[0.25, 0, 0]} rotation={[0, 0, Math.PI/2]} />

            {/* ============ ELBOW ROTATION GROUP ============ */}
            <group ref={elbowRef}>
              {/* Lower arm link (L3 = 3.5 units) */}
              <WoodenLink length={L3} />
              
              {/* Screws on lower arm */}
              <Screw position={[0.18, 0.3, 0]} />
              <Screw position={[0.18, L3 - 0.3, 0]} />

              {/* ============ WRIST JOINT ============ */}
              <group position={[0, L3, 0]}>
                {/* Wrist joint block */}
                <mesh>
                  <boxGeometry args={[0.35, 0.25, 0.35]} />
                  <meshStandardMaterial color={WOOD_MEDIUM} roughness={0.8} />
                </mesh>

                {/* Wrist servo (J4) - visible */}
                <ServoMotor position={[0.2, 0, 0]} rotation={[0, 0, Math.PI/2]} small />

                {/* ============ WRIST ROTATION GROUP ============ */}
                <group ref={wristRef}>
                  {/* Gripper mount */}
                  <mesh position={[0, 0.2, 0]}>
                    <boxGeometry args={[0.25, 0.15, 0.25]} />
                    <meshStandardMaterial color={WOOD_DARK} roughness={0.75} />
                  </mesh>

                  {/* Gripper assembly */}
                  <Gripper position={[0, 0.35, 0]} />
                </group>
              </group>
            </group>
          </group>
        </group>
      </group>
    </group>
  );
};

// Servo Motor Component (visible at joints)
interface ServoMotorProps {
  position: [number, number, number];
  rotation: [number, number, number];
  horizontal?: boolean;
  small?: boolean;
}

const ServoMotor = ({ position, rotation, horizontal, small }: ServoMotorProps) => {
  const scale = small ? 0.7 : 1;
  const bodySize: [number, number, number] = horizontal 
    ? [0.4 * scale, 0.2 * scale, 0.25 * scale]
    : [0.35 * scale, 0.45 * scale, 0.2 * scale];
  
  return (
    <group position={position} rotation={rotation}>
      {/* Servo body */}
      <mesh>
        <boxGeometry args={bodySize} />
        <meshStandardMaterial color={SERVO_BLUE} roughness={0.4} />
      </mesh>
      
      {/* Servo output horn */}
      <mesh position={horizontal ? [0, 0.12 * scale, 0] : [0, 0.25 * scale, 0]}>
        <cylinderGeometry args={[0.08 * scale, 0.08 * scale, 0.05, 16]} />
        <meshStandardMaterial color={METAL_SILVER} metalness={0.7} roughness={0.3} />
      </mesh>
      
      {/* Servo shaft */}
      <mesh position={horizontal ? [0, 0.15 * scale, 0] : [0, 0.28 * scale, 0]}>
        <cylinderGeometry args={[0.025 * scale, 0.025 * scale, 0.08 * scale, 12]} />
        <meshStandardMaterial color={SERVO_BLACK} metalness={0.6} roughness={0.4} />
      </mesh>

      {/* Mounting tabs */}
      {!horizontal && (
        <>
          <mesh position={[0, -0.18 * scale, 0.12 * scale]}>
            <boxGeometry args={[0.35 * scale, 0.08 * scale, 0.04 * scale]} />
            <meshStandardMaterial color={SERVO_BLUE} roughness={0.4} />
          </mesh>
          <mesh position={[0, -0.18 * scale, -0.12 * scale]}>
            <boxGeometry args={[0.35 * scale, 0.08 * scale, 0.04 * scale]} />
            <meshStandardMaterial color={SERVO_BLUE} roughness={0.4} />
          </mesh>
        </>
      )}

      {/* Cable coming out */}
      <mesh position={horizontal ? [-0.22 * scale, 0, 0] : [0, -0.25 * scale, 0]}>
        <boxGeometry args={[0.06 * scale, 0.03 * scale, 0.08 * scale]} />
        <meshStandardMaterial color="#333" roughness={0.6} />
      </mesh>
    </group>
  );
};

// Wooden Link Component
interface WoodenLinkProps {
  length: number;
}

const WoodenLink = ({ length }: WoodenLinkProps) => {
  return (
    <group>
      {/* Main wooden beam */}
      <mesh position={[0, length / 2, 0]}>
        <boxGeometry args={[0.3, length, 0.2]} />
        <meshStandardMaterial color={WOOD_LIGHT} roughness={0.8} />
      </mesh>
      
      {/* Wood grain detail (darker strips) */}
      <mesh position={[0.155, length / 2, 0]}>
        <boxGeometry args={[0.01, length - 0.1, 0.18]} />
        <meshStandardMaterial color={WOOD_DARK} roughness={0.85} />
      </mesh>
      <mesh position={[-0.155, length / 2, 0]}>
        <boxGeometry args={[0.01, length - 0.1, 0.18]} />
        <meshStandardMaterial color={WOOD_DARK} roughness={0.85} />
      </mesh>
    </group>
  );
};

// Screw Component
interface ScrewProps {
  position: [number, number, number];
}

const Screw = ({ position }: ScrewProps) => {
  return (
    <group position={position}>
      <mesh rotation={[0, 0, Math.PI/2]}>
        <cylinderGeometry args={[0.04, 0.04, 0.06, 8]} />
        <meshStandardMaterial color={SCREW_GOLD} metalness={0.8} roughness={0.2} />
      </mesh>
      {/* Screw head slot */}
      <mesh position={[0.035, 0, 0]} rotation={[0, 0, Math.PI/2]}>
        <boxGeometry args={[0.06, 0.01, 0.015]} />
        <meshStandardMaterial color="#8a7a20" metalness={0.7} roughness={0.3} />
      </mesh>
    </group>
  );
};

// Gripper Component
interface GripperProps {
  position: [number, number, number];
}

const Gripper = ({ position }: GripperProps) => {
  return (
    <group position={position}>
      {/* Gripper base */}
      <mesh>
        <boxGeometry args={[0.3, 0.1, 0.2]} />
        <meshStandardMaterial color={WOOD_MEDIUM} roughness={0.8} />
      </mesh>

      {/* Left finger */}
      <group position={[-0.1, 0.15, 0]} rotation={[0, 0, 0.15]}>
        <mesh position={[0, 0.15, 0]}>
          <boxGeometry args={[0.06, 0.3, 0.1]} />
          <meshStandardMaterial color={WOOD_DARK} roughness={0.75} />
        </mesh>
        {/* Finger tip */}
        <mesh position={[0.02, 0.32, 0]} rotation={[0, 0, -0.3]}>
          <boxGeometry args={[0.05, 0.1, 0.08]} />
          <meshStandardMaterial color={METAL_SILVER} metalness={0.6} roughness={0.4} />
        </mesh>
      </group>

      {/* Right finger */}
      <group position={[0.1, 0.15, 0]} rotation={[0, 0, -0.15]}>
        <mesh position={[0, 0.15, 0]}>
          <boxGeometry args={[0.06, 0.3, 0.1]} />
          <meshStandardMaterial color={WOOD_DARK} roughness={0.75} />
        </mesh>
        {/* Finger tip */}
        <mesh position={[-0.02, 0.32, 0]} rotation={[0, 0, 0.3]}>
          <boxGeometry args={[0.05, 0.1, 0.08]} />
          <meshStandardMaterial color={METAL_SILVER} metalness={0.6} roughness={0.4} />
        </mesh>
      </group>

      {/* Gripper hinge screws */}
      <mesh position={[-0.1, 0.05, 0.08]} rotation={[Math.PI/2, 0, 0]}>
        <cylinderGeometry args={[0.02, 0.02, 0.04, 8]} />
        <meshStandardMaterial color={SCREW_GOLD} metalness={0.8} roughness={0.2} />
      </mesh>
      <mesh position={[0.1, 0.05, 0.08]} rotation={[Math.PI/2, 0, 0]}>
        <cylinderGeometry args={[0.02, 0.02, 0.04, 8]} />
        <meshStandardMaterial color={SCREW_GOLD} metalness={0.8} roughness={0.2} />
      </mesh>
    </group>
  );
};

export default RobotArm;