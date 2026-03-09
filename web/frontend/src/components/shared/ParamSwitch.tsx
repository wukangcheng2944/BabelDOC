import { Switch } from "@/components/ui/switch";
import { ParamRow } from "./ParamRow";

interface ParamSwitchProps {
  label: string;
  tooltip?: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  disabled?: boolean;
  overridden?: boolean;
  overrideLabel?: string;
}

export function ParamSwitch({
  label,
  tooltip,
  checked,
  onCheckedChange,
  disabled,
  overridden,
  overrideLabel,
}: ParamSwitchProps) {
  return (
    <ParamRow label={label} tooltip={tooltip} overridden={overridden} overrideLabel={overrideLabel}>
      <Switch
        checked={checked}
        onCheckedChange={onCheckedChange}
        disabled={disabled || overridden}
      />
    </ParamRow>
  );
}
