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

// Wood color for main structure
const WOOD_COLOR = '#a67c52';
const WOOD_DARK = '#8b6914';
// Metal/gray for hydraulic and joints
const METAL_COLOR = '#7a7a7a';
const METAL_DARK = '#4a4a4a';
// Gripper color
const GRIPPER_COLOR = '#5a4a3a';

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
      shoulderRef.current.rotation.z = THREE.MathUtils.degToRad(joints.shoulder);
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
      {/* Wooden Base Platform */}
      <mesh position={[0, -0.1, 0]}>
        <boxGeometry args={[2.5, 0.2, 1.2]} />
        <meshStandardMaterial color={WOOD_COLOR} roughness={0.8} />
      </mesh>

      {/* Base Rotation Group (J1) */}
      <group ref={baseRef}>
        {/* Vertical Wooden Post */}
        <mesh position={[0, 2, 0]}>
          <boxGeometry args={[0.3, 4, 0.3]} />
          <meshStandardMaterial color={WOOD_COLOR} roughness={0.8} />
        </mesh>

        {/* Diagonal Support Brace */}
        <mesh position={[0.8, 1.8, 0]} rotation={[0, 0, -0.7]}>
          <boxGeometry args={[0.2, 3.8, 0.15]} />
          <meshStandardMaterial color={WOOD_COLOR} roughness={0.8} />
        </mesh>

        {/* Top Joint Block */}
        <mesh position={[0, 4.1, 0]}>
          <boxGeometry args={[0.5, 0.3, 0.4]} />
          <meshStandardMaterial color={METAL_COLOR} metalness={0.6} roughness={0.4} />
        </mesh>

        {/* Shoulder Joint (J2) */}
        <group ref={shoulderRef} position={[0, 4.1, 0]}>
          {/* Main Arm Segment (wooden beam) */}
          <mesh position={[0, -1.5, 0.25]}>
            <boxGeometry args={[0.25, 2.8, 0.2]} />
            <meshStandardMaterial color={WOOD_COLOR} roughness={0.8} />
          </mesh>

          {/* Hydraulic Cylinder Mount */}
          <mesh position={[-0.3, -0.3, 0]}>
            <boxGeometry args={[0.15, 0.4, 0.3]} />
            <meshStandardMaterial color={METAL_DARK} metalness={0.7} roughness={0.3} />
          </mesh>

          {/* Hydraulic Cylinder (silver tube) */}
          <mesh position={[-0.3, -1.4, 0]}>
            <cylinderGeometry args={[0.08, 0.08, 2, 16]} />
            <meshStandardMaterial color={METAL_COLOR} metalness={0.8} roughness={0.2} />
          </mesh>

          {/* Inner Hydraulic Rod */}
          <mesh position={[-0.3, -2.2, 0]}>
            <cylinderGeometry args={[0.04, 0.04, 0.8, 16]} />
            <meshStandardMaterial color="#c0c0c0" metalness={0.9} roughness={0.1} />
          </mesh>

          {/* Elbow Joint Block */}
          <mesh position={[0, -3, 0]}>
            <boxGeometry args={[0.4, 0.25, 0.4]} />
            <meshStandardMaterial color={METAL_COLOR} metalness={0.6} roughness={0.4} />
          </mesh>

          {/* Elbow Joint (J3) */}
          <group ref={elbowRef} position={[0, -3, 0]}>
            {/* Lower Arm Segment */}
            <mesh position={[0, -1, 0]}>
              <boxGeometry args={[0.2, 1.8, 0.18]} />
              <meshStandardMaterial color={WOOD_DARK} roughness={0.8} />
            </mesh>

            {/* Secondary Hydraulic/Cable */}
            <mesh position={[-0.2, -0.8, 0]}>
              <cylinderGeometry args={[0.025, 0.025, 1.4, 8]} />
              <meshStandardMaterial color={METAL_DARK} metalness={0.5} roughness={0.5} />
            </mesh>

            {/* Wrist Joint Mount */}
            <mesh position={[0, -2, 0]}>
              <boxGeometry args={[0.3, 0.2, 0.3]} />
              <meshStandardMaterial color={METAL_COLOR} metalness={0.6} roughness={0.4} />
            </mesh>

            {/* Wrist Joint (J4) */}
            <group ref={wristRef} position={[0, -2.1, 0]}>
              {/* Gripper Base */}
              <mesh position={[0, -0.25, 0]}>
                <boxGeometry args={[0.35, 0.3, 0.25]} />
                <meshStandardMaterial color={GRIPPER_COLOR} roughness={0.7} />
              </mesh>

              {/* Gripper Fingers */}
              <GripperFinger position={[0.12, -0.55, 0]} rotation={[0, 0, 0.15]} />
              <GripperFinger position={[-0.12, -0.55, 0]} rotation={[0, 0, -0.15]} mirrored />
            </group>
          </group>
        </group>
      </group>

      {/* Cable/Wire on floor */}
      <mesh position={[0.5, -0.05, 0.4]} rotation={[0, 0.3, Math.PI / 2]}>
        <torusGeometry args={[0.3, 0.02, 8, 16, Math.PI]} />
        <meshStandardMaterial color="#c41e1e" roughness={0.6} />
      </mesh>
    </group>
  );
};

interface GripperFingerProps {
  position: [number, number, number];
  rotation: [number, number, number];
  mirrored?: boolean;
}

const GripperFinger = ({ position, rotation, mirrored }: GripperFingerProps) => {
  const xScale = mirrored ? -1 : 1;
  return (
    <group position={position} rotation={rotation}>
      {/* Finger base */}
      <mesh>
        <boxGeometry args={[0.08, 0.35, 0.12]} />
        <meshStandardMaterial color={GRIPPER_COLOR} roughness={0.7} />
      </mesh>
      {/* Finger tip (curved inward) */}
      <mesh position={[0.03 * xScale, -0.22, 0]} rotation={[0, 0, 0.3 * xScale]}>
        <boxGeometry args={[0.06, 0.15, 0.1]} />
        <meshStandardMaterial color={METAL_DARK} metalness={0.5} roughness={0.5} />
      </mesh>
    </group>
  );
};

export default RobotArm;
