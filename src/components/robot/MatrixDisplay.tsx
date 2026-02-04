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

  return (
    <div className="matrix-display">
      <div className="text-muted-foreground mb-2">Matrix: Calculating \ftal {'{'}</div>
      <div className="space-y-1 text-foreground/90">
        <div>
          request document <span className="text-primary">xdbVxWorld</span> | S[{position.x.toFixed(1)} 2]
        </div>
        <div>
          mn| 1 | Smk 2 | <span className="text-accent">fmt</span> FriseWorld | 8[{position.y.toFixed(1)} 2]
        </div>
        <div>
          decuest froument <span className="text-primary">natrixWorld</span> | ff[{position.z.toFixed(1)} 3]
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
