import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Label } from "@/components/ui/label";
import { HelpCircle } from "lucide-react";

interface ParamRowProps {
  label: string;
  tooltip?: string;
  overridden?: boolean;
  overrideLabel?: string;
  children: React.ReactNode;
}

export function ParamRow({
  label,
  tooltip,
  overridden,
  overrideLabel,
  children,
}: ParamRowProps) {
  return (
    <div className="flex items-center justify-between gap-4 py-2">
      <div className="flex items-center gap-2 shrink-0">
        <Label className="text-sm text-foreground">{label}</Label>
        {tooltip && (
          <Tooltip>
            <TooltipTrigger asChild>
              <HelpCircle className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
            </TooltipTrigger>
            <TooltipContent side="top" className="max-w-xs text-xs">
              {tooltip}
            </TooltipContent>
          </Tooltip>
        )}
        {overridden && (
          <span className="text-xs text-amber-400 bg-amber-400/10 px-1.5 py-0.5 rounded">
            {overrideLabel ?? "Overridden"}
          </span>
        )}
      </div>
      <div className="flex items-center gap-2">{children}</div>
    </div>
  );
}
