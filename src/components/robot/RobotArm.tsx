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

// Steel blue color for arm segments
const ARM_COLOR = '#4a7eb0';
// Orange color for joints
const JOINT_COLOR = '#d4832f';
// Dark gray for base and gripper
const BASE_COLOR = '#3d5a80';
const GRIPPER_COLOR = '#4a4a4a';

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
      {/* Base Platform */}
      <mesh position={[0, -0.15, 0]}>
        <cylinderGeometry args={[1.2, 1.4, 0.3, 32]} />
        <meshStandardMaterial color={BASE_COLOR} metalness={0.6} roughness={0.4} />
      </mesh>

      {/* Base Rotation Joint (J1) */}
      <group ref={baseRef}>
        {/* Base Joint Cylinder */}
        <mesh position={[0, 0.2, 0]}>
          <cylinderGeometry args={[0.5, 0.5, 0.4, 32]} />
          <meshStandardMaterial color={JOINT_COLOR} metalness={0.7} roughness={0.3} />
        </mesh>

        {/* Shoulder Mount */}
        <mesh position={[0, 0.6, 0]}>
          <boxGeometry args={[0.6, 0.5, 0.5]} />
          <meshStandardMaterial color={ARM_COLOR} metalness={0.6} roughness={0.4} />
        </mesh>

        {/* Shoulder Joint (J2) */}
        <group ref={shoulderRef} position={[0, 0.85, 0]}>
          {/* Shoulder Joint Sphere */}
          <mesh position={[0, 0, 0.35]}>
            <sphereGeometry args={[0.3, 32, 32]} />
            <meshStandardMaterial color={JOINT_COLOR} metalness={0.7} roughness={0.3} />
          </mesh>
          <mesh position={[0, 0, -0.35]}>
            <sphereGeometry args={[0.3, 32, 32]} />
            <meshStandardMaterial color={JOINT_COLOR} metalness={0.7} roughness={0.3} />
          </mesh>

          {/* Upper Arm Segment */}
          <mesh position={[1.5, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.15, 0.15, 2.6, 16]} />
            <meshStandardMaterial color={ARM_COLOR} metalness={0.6} roughness={0.4} />
          </mesh>

          {/* Elbow Joint Mount */}
          <mesh position={[2.8, 0, 0]}>
            <boxGeometry args={[0.4, 0.5, 0.7]} />
            <meshStandardMaterial color={ARM_COLOR} metalness={0.6} roughness={0.4} />
          </mesh>

          {/* Elbow Joint (J3) */}
          <group ref={elbowRef} position={[2.9, 0, 0]}>
            {/* Elbow Joint Sphere */}
            <mesh position={[0, 0, 0.4]}>
              <sphereGeometry args={[0.25, 32, 32]} />
              <meshStandardMaterial color={JOINT_COLOR} metalness={0.7} roughness={0.3} />
            </mesh>
            <mesh position={[0, 0, -0.4]}>
              <sphereGeometry args={[0.25, 32, 32]} />
              <meshStandardMaterial color={JOINT_COLOR} metalness={0.7} roughness={0.3} />
            </mesh>

            {/* Lower Arm Segment */}
            <mesh position={[1.3, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.12, 0.12, 2.2, 16]} />
              <meshStandardMaterial color={ARM_COLOR} metalness={0.6} roughness={0.4} />
            </mesh>

            {/* Wrist Mount */}
            <mesh position={[2.4, 0, 0]}>
              <boxGeometry args={[0.3, 0.35, 0.5]} />
              <meshStandardMaterial color={ARM_COLOR} metalness={0.6} roughness={0.4} />
            </mesh>

            {/* Wrist Joint (J4) */}
            <group ref={wristRef} position={[2.55, 0, 0]}>
              {/* Wrist Joint Sphere */}
              <mesh>
                <sphereGeometry args={[0.2, 32, 32]} />
                <meshStandardMaterial color={JOINT_COLOR} metalness={0.7} roughness={0.3} />
              </mesh>

              {/* Gripper Base */}
              <mesh position={[0.5, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
                <cylinderGeometry args={[0.15, 0.2, 0.6, 16]} />
                <meshStandardMaterial color={GRIPPER_COLOR} metalness={0.5} roughness={0.5} />
              </mesh>

              {/* Gripper Fingers */}
              <GripperFinger position={[0.9, 0.15, 0]} rotation={[0, 0, 0.2]} />
              <GripperFinger position={[0.9, -0.15, 0]} rotation={[0, 0, -0.2]} />
            </group>
          </group>
        </group>
      </group>
    </group>
  );
};

interface GripperFingerProps {
  position: [number, number, number];
  rotation: [number, number, number];
}

const GripperFinger = ({ position, rotation }: GripperFingerProps) => {
  return (
    <group position={position} rotation={rotation}>
      <mesh>
        <boxGeometry args={[0.5, 0.08, 0.15]} />
        <meshStandardMaterial color={GRIPPER_COLOR} metalness={0.5} roughness={0.5} />
      </mesh>
      <mesh position={[0.25, -0.08, 0]} rotation={[0, 0, -0.3]}>
        <boxGeometry args={[0.3, 0.08, 0.12]} />
        <meshStandardMaterial color={GRIPPER_COLOR} metalness={0.5} roughness={0.5} />
      </mesh>
    </group>
  );
};

export default RobotArm;
