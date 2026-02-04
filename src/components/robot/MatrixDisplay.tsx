import { useMemo } from 'react';

interface MatrixDisplayProps {
  joints: {
    base: number;
    shoulder: number;
    elbow: number;
    wrist: number;
  };
}

// Calculate forward kinematics for the end effector position
const calculateEndEffector = (joints: MatrixDisplayProps['joints']) => {
  const { base, shoulder, elbow, wrist } = joints;
  
  // Convert to radians
  const b = (base * Math.PI) / 180;
  const s = (shoulder * Math.PI) / 180;
  const e = (elbow * Math.PI) / 180;
  const w = (wrist * Math.PI) / 180;
  
  // Link lengths (matching the 3D model)
  const L1 = 0.85; // Base to shoulder
  const L2 = 2.8;  // Shoulder to elbow
  const L3 = 2.4;  // Elbow to wrist
  const L4 = 0.9;  // Wrist to end effector
  
  // Forward kinematics calculation
  const totalAngle = s + e + w;
  
  const x = Math.cos(b) * (
    L2 * Math.cos(s) + 
    L3 * Math.cos(s + e) + 
    L4 * Math.cos(totalAngle)
  );
  
  const y = L1 + 
    L2 * Math.sin(s) + 
    L3 * Math.sin(s + e) + 
    L4 * Math.sin(totalAngle);
  
  const z = Math.sin(b) * (
    L2 * Math.cos(s) + 
    L3 * Math.cos(s + e) + 
    L4 * Math.cos(totalAngle)
  );
  
  return { x, y, z };
};

export const MatrixDisplay = ({ joints }: MatrixDisplayProps) => {
  const position = useMemo(() => calculateEndEffector(joints), [joints]);

  // Calculate rotation matrix components
  const b = (joints.base * Math.PI) / 180;
  const totalAngle = ((joints.shoulder + joints.elbow + joints.wrist) * Math.PI) / 180;
  
  const cosB = Math.cos(b);
  const sinB = Math.sin(b);
  const cosT = Math.cos(totalAngle);
  const sinT = Math.sin(totalAngle);

  return (
    <div className="matrix-display">
      <div className="text-muted-foreground mb-2 font-mono text-xs">Transformation Matrix T₀₄:</div>
      <div className="space-y-0.5 text-foreground/90 font-mono text-xs bg-secondary/30 rounded p-2">
        <div className="grid grid-cols-4 gap-1 text-center">
          <span>{(cosB * cosT).toFixed(2)}</span>
          <span>{(-cosB * sinT).toFixed(2)}</span>
          <span>{sinB.toFixed(2)}</span>
          <span className="text-primary">{position.x.toFixed(2)}</span>
        </div>
        <div className="grid grid-cols-4 gap-1 text-center">
          <span>{sinT.toFixed(2)}</span>
          <span>{cosT.toFixed(2)}</span>
          <span>0.00</span>
          <span className="text-primary">{position.y.toFixed(2)}</span>
        </div>
        <div className="grid grid-cols-4 gap-1 text-center">
          <span>{(-sinB * cosT).toFixed(2)}</span>
          <span>{(sinB * sinT).toFixed(2)}</span>
          <span>{cosB.toFixed(2)}</span>
          <span className="text-primary">{position.z.toFixed(2)}</span>
        </div>
        <div className="grid grid-cols-4 gap-1 text-center text-muted-foreground">
          <span>0</span>
          <span>0</span>
          <span>0</span>
          <span>1</span>
        </div>
      </div>
      <div className="mt-3 pt-3 border-t border-panel-border">
        <div className="text-xs text-muted-foreground mb-1">End Effector Position:</div>
        <div className="grid grid-cols-3 gap-2 text-xs">
          <div className="bg-secondary/50 rounded px-2 py-1">
            <span className="text-muted-foreground">X:</span>{' '}
            <span className="text-foreground">{position.x.toFixed(2)}</span>
          </div>
          <div className="bg-secondary/50 rounded px-2 py-1">
            <span className="text-muted-foreground">Y:</span>{' '}
            <span className="text-foreground">{position.y.toFixed(2)}</span>
          </div>
          <div className="bg-secondary/50 rounded px-2 py-1">
            <span className="text-muted-foreground">Z:</span>{' '}
            <span className="text-foreground">{position.z.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MatrixDisplay;
