import { motion } from "framer-motion";
import { KeyRound } from "lucide-react";
import type { PresetStorageMap } from "@/types/config";
import { modelPresets } from "@/lib/presets";
import { cn } from "@/lib/utils";
import { useI18n } from "@/hooks/use-i18n";

interface ModelPresetSelectorProps {
  selectedId: string;
  presetStorage: PresetStorageMap;
  onSelect: (presetId: string) => void;
}

const presetLogos: Record<string, string> = {
  openai: "O",
  deepseek: "DS",
  qwen: "Q",
  glm: "G",
  kimi: "K",
  ollama: "OL",
  custom: "...",
};

const presetColors: Record<string, string> = {
  openai: "bg-green-500/10 text-green-400 border-green-500/20",
  deepseek: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  qwen: "bg-purple-500/10 text-purple-400 border-purple-500/20",
  glm: "bg-orange-500/10 text-orange-400 border-orange-500/20",
  kimi: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
  ollama: "bg-muted text-muted-foreground border-border/50",
  custom: "bg-muted text-muted-foreground border-border/50",
};

export function ModelPresetSelector({
  selectedId,
  presetStorage,
  onSelect,
}: ModelPresetSelectorProps) {
  const { locale } = useI18n();

  return (
    <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-7">
      {modelPresets.map((preset, index) => {
        const isSelected = selectedId === preset.id;
        const logo = presetLogos[preset.id] ?? preset.name[0];
        const colorClasses =
          presetColors[preset.id] ?? "bg-muted text-muted-foreground";

        // Check if this preset has a saved API key
        const saved = presetStorage[preset.id];
        const hasApiKey = !!saved?.openaiApiKey;

        return (
          <motion.button
            key={preset.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
            onClick={() => onSelect(preset.id)}
            className={cn(
              "relative flex flex-col items-center gap-2 rounded-xl border p-3 transition-all duration-200",
              isSelected
                ? "ring-2 ring-primary border-primary/30 bg-primary/5 shadow-md shadow-primary/10"
                : "border-border/50 bg-card hover:shadow-md hover:border-border"
            )}
          >
            {/* Configured indicator */}
            {hasApiKey && (
              <div className="absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-green-500 text-white shadow-sm">
                <KeyRound className="h-2.5 w-2.5" />
              </div>
            )}
            <div
              className={cn(
                "flex h-10 w-10 items-center justify-center rounded-lg text-xs font-bold border",
                colorClasses
              )}
            >
              {logo}
            </div>
            <div className="text-center">
              <p className="text-xs font-medium text-foreground">
                {preset.id === "custom"
                  ? locale === "zh"
                    ? "自定义"
                    : "Custom"
                  : preset.name}
              </p>
            </div>
          </motion.button>
        );
      })}
    </div>
  );
}
