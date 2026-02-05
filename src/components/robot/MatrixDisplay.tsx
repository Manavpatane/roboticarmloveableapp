import { useMemo } from 'react';

interface MatrixDisplayProps {
  joints: {
    base: number;
    shoulder: number;
    elbow: number;
    wrist: number;
  };
}

// DH Parameters (matching MATLAB code)
// Link lengths in meters
const L1 = 0.05;  // base to shoulder (5 cm)
const L2 = 0.30;  // shoulder to elbow (30 cm)
const L3 = 0.35;  // elbow to wrist (35 cm)

// Calculate forward kinematics using DH parameters
const calculateEndEffector = (joints: MatrixDisplayProps['joints']) => {
  const { base, shoulder, elbow } = joints;
  
  // Convert to radians
  const th1 = (base * Math.PI) / 180;
  const th2 = (shoulder * Math.PI) / 180;
  const th3 = (elbow * Math.PI) / 180;
  
  // Planar FK (from MATLAB code)
  const r = L2 * Math.cos(th2) + L3 * Math.cos(th2 + th3);
  const z = L1 + L2 * Math.sin(th2) + L3 * Math.sin(th2 + th3);
  
  // Convert to 3D
  const x = r * Math.cos(th1);
  const y = r * Math.sin(th1);
  
  return { x, y, z };
};

// DH Parameter Table Data
const getDHParameters = (joints: MatrixDisplayProps['joints']) => {
  const th1 = (joints.base * Math.PI) / 180;
  const th2 = (joints.shoulder * Math.PI) / 180;
  const th3 = (joints.elbow * Math.PI) / 180;
  
  return [
    { joint: 1, a: 0, alpha: Math.PI/2, d: L1, theta: th1 },
    { joint: 2, a: L2, alpha: 0, d: 0, theta: th2 },
    { joint: 3, a: L3, alpha: 0, d: 0, theta: th3 },
  ];
};

export const MatrixDisplay = ({ joints }: MatrixDisplayProps) => {
  const position = useMemo(() => calculateEndEffector(joints), [joints]);
  const dhParams = useMemo(() => getDHParameters(joints), [joints]);

  // Calculate transformation matrix components
  const th1 = (joints.base * Math.PI) / 180;
  const th2 = (joints.shoulder * Math.PI) / 180;
  const th3 = (joints.elbow * Math.PI) / 180;
  const th23 = th2 + th3;
  
  const c1 = Math.cos(th1), s1 = Math.sin(th1);
  const c23 = Math.cos(th23), s23 = Math.sin(th23);

  return (
    <div className="matrix-display">
      {/* DH Parameters Table */}
      <div className="text-muted-foreground mb-2 font-mono text-xs">DH Parameters:</div>
      <div className="space-y-0.5 text-foreground/90 font-mono text-[10px] bg-secondary/30 rounded p-2 mb-3">
        <div className="grid grid-cols-5 gap-1 text-center text-muted-foreground border-b border-border pb-1 mb-1">
          <span>Joint</span>
          <span>a (m)</span>
          <span>α (rad)</span>
          <span>d (m)</span>
          <span>θ (rad)</span>
        </div>
        {dhParams.map((row) => (
          <div key={row.joint} className="grid grid-cols-5 gap-1 text-center">
            <span className="text-primary">J{row.joint}</span>
            <span>{row.a.toFixed(2)}</span>
            <span>{row.alpha.toFixed(2)}</span>
            <span>{row.d.toFixed(2)}</span>
            <span className="text-primary">{row.theta.toFixed(2)}</span>
          </div>
        ))}
      </div>

      <div className="text-muted-foreground mb-2 font-mono text-xs">Transformation Matrix T₀₃:</div>
      <div className="space-y-0.5 text-foreground/90 font-mono text-xs bg-secondary/30 rounded p-2">
        <div className="grid grid-cols-4 gap-1 text-center">
          <span>{(c1 * c23).toFixed(2)}</span>
          <span>{(-c1 * s23).toFixed(2)}</span>
          <span>{s1.toFixed(2)}</span>
          <span className="text-primary">{position.x.toFixed(3)}</span>
        </div>
        <div className="grid grid-cols-4 gap-1 text-center">
          <span>{(s1 * c23).toFixed(2)}</span>
          <span>{(-s1 * s23).toFixed(2)}</span>
          <span>{(-c1).toFixed(2)}</span>
          <span className="text-primary">{position.y.toFixed(3)}</span>
        </div>
        <div className="grid grid-cols-4 gap-1 text-center">
          <span>{s23.toFixed(2)}</span>
          <span>{c23.toFixed(2)}</span>
          <span>0.00</span>
          <span className="text-primary">{position.z.toFixed(3)}</span>
        </div>
        <div className="grid grid-cols-4 gap-1 text-center text-muted-foreground">
          <span>0</span>
          <span>0</span>
          <span>0</span>
          <span>1</span>
        </div>
      </div>
      <div className="mt-3 pt-3 border-t border-panel-border">
        <div className="text-xs text-muted-foreground mb-1">End Effector Position (meters):</div>
        <div className="grid grid-cols-3 gap-2 text-xs">
          <div className="bg-secondary/50 rounded px-2 py-1">
            <span className="text-muted-foreground">X:</span>{' '}
            <span className="text-foreground">{position.x.toFixed(3)}</span>
          </div>
          <div className="bg-secondary/50 rounded px-2 py-1">
            <span className="text-muted-foreground">Y:</span>{' '}
            <span className="text-foreground">{position.y.toFixed(3)}</span>
          </div>
          <div className="bg-secondary/50 rounded px-2 py-1">
            <span className="text-muted-foreground">Z:</span>{' '}
            <span className="text-foreground">{position.z.toFixed(3)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MatrixDisplay;
