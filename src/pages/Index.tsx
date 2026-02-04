import { useState } from 'react';
import { Scene } from '@/components/robot/Scene';
import { ControlPanel } from '@/components/robot/ControlPanel';
import { MatrixDisplay } from '@/components/robot/MatrixDisplay';
import { Info } from 'lucide-react';

const Index = () => {
  const [joints, setJoints] = useState({
    base: 0,
    shoulder: 0,
    elbow: 0,
    wrist: 0,
  });

  const handleJointChange = (joint: string, value: number) => {
    setJoints((prev) => ({
      ...prev,
      [joint]: value,
    }));
  };

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-background">
      {/* Header */}
      <div className="absolute top-0 left-0 z-10 bg-card/95 backdrop-blur-sm border-b border-border px-4 py-2">
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground text-sm">#UI</span>
          <h1 className="text-lg font-semibold text-foreground">
            4-DOF Robot Sim
          </h1>
        </div>
      </div>

      {/* 3D Canvas */}
      <div className="h-full w-full">
        <Scene joints={joints} />
      </div>

      {/* Control Panel */}
      <div className="absolute top-14 left-4 z-10 w-72">
        <ControlPanel joints={joints} onJointChange={handleJointChange} />
      </div>

      {/* Matrix Display */}
      <div className="absolute top-[280px] left-4 z-10 w-72">
        <MatrixDisplay joints={joints} />
      </div>

      {/* Info Button */}
      <button className="absolute top-14 right-4 z-10 p-2 bg-card/95 backdrop-blur-sm rounded-full border border-border hover:bg-secondary transition-colors">
        <Info className="w-5 h-5 text-muted-foreground" />
      </button>

      {/* Viewport Controls Hint */}
      <div className="absolute bottom-4 right-4 z-10 text-xs text-muted-foreground bg-card/80 backdrop-blur-sm px-3 py-2 rounded">
        <span>Left click: Rotate</span>
        <span className="mx-2">|</span>
        <span>Right click: Pan</span>
        <span className="mx-2">|</span>
        <span>Scroll: Zoom</span>
      </div>
    </div>
  );
};

export default Index;
