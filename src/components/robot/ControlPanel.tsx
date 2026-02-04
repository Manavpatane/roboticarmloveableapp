import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';

interface JointControl {
  id: string;
  label: string;
  value: number;
  min: number;
  max: number;
  onChange: (value: number) => void;
}

interface ControlPanelProps {
  joints: {
    base: number;
    shoulder: number;
    elbow: number;
    wrist: number;
  };
  onJointChange: (joint: string, value: number) => void;
}

export const ControlPanel = ({ joints, onJointChange }: ControlPanelProps) => {
  const controls: JointControl[] = [
    {
      id: 'base',
      label: 'Base Swivel',
      value: joints.base,
      min: -180,
      max: 180,
      onChange: (v) => onJointChange('base', v),
    },
    {
      id: 'shoulder',
      label: 'Shoulder',
      value: joints.shoulder,
      min: -90,
      max: 90,
      onChange: (v) => onJointChange('shoulder', v),
    },
    {
      id: 'elbow',
      label: 'Elbow',
      value: joints.elbow,
      min: -135,
      max: 135,
      onChange: (v) => onJointChange('elbow', v),
    },
    {
      id: 'wrist',
      label: 'Wrist',
      value: joints.wrist,
      min: -180,
      max: 180,
      onChange: (v) => onJointChange('wrist', v),
    },
  ];

  return (
    <div className="control-panel space-y-3">
      <div className="text-sm font-medium text-muted-foreground mb-2">
        Scene State:
      </div>
      {controls.map((control, index) => (
        <div key={control.id} className="flex items-center gap-3">
          <span className="text-xs text-muted-foreground w-6">J{index + 1}</span>
          <span className="text-sm font-medium w-24 text-foreground">
            {control.label}
          </span>
          <div className="flex-1">
            <Slider
              value={[control.value]}
              min={control.min}
              max={control.max}
              step={1}
              onValueChange={([v]) => control.onChange(v)}
              className="joint-slider"
            />
          </div>
          <Input
            type="number"
            value={control.value}
            onChange={(e) => control.onChange(Number(e.target.value))}
            className="w-16 h-7 text-xs bg-secondary border-border text-foreground text-center"
            min={control.min}
            max={control.max}
          />
        </div>
      ))}
    </div>
  );
};

export default ControlPanel;
