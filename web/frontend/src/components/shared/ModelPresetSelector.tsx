import { motion } from "framer-motion";
import type { ModelPreset } from "@/types/config";
import { modelPresets } from "@/lib/presets";
import { cn } from "@/lib/utils";
import { useI18n } from "@/hooks/use-i18n";

interface ModelPresetSelectorProps {
  selectedId: string;
  onSelect: (preset: ModelPreset) => void;
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
  openai: "bg-green-50 text-green-700 border-green-100",
  deepseek: "bg-blue-50 text-blue-700 border-blue-100",
  qwen: "bg-purple-50 text-purple-700 border-purple-100",
  glm: "bg-orange-50 text-orange-700 border-orange-100",
  kimi: "bg-cyan-50 text-cyan-700 border-cyan-100",
  ollama: "bg-gray-50 text-gray-700 border-gray-100",
  custom: "bg-slate-50 text-slate-700 border-slate-100",
};

export function ModelPresetSelector({
  selectedId,
  onSelect,
}: ModelPresetSelectorProps) {
  const { locale } = useI18n();

  return (
    <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-7">
      {modelPresets.map((preset, index) => {
        const isSelected = selectedId === preset.id;
        const logo = presetLogos[preset.id] ?? preset.name[0];
        const colorClasses = presetColors[preset.id] ?? "bg-gray-50 text-gray-700";

        return (
          <motion.button
            key={preset.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
            onClick={() => onSelect(preset)}
            className={cn(
              "flex flex-col items-center gap-2 rounded-xl border p-3 transition-all duration-200",
              isSelected
                ? "ring-2 ring-blue-600 border-blue-200 bg-blue-50/50 shadow-md"
                : "border-gray-100 bg-white hover:shadow-md hover:border-gray-200"
            )}
          >
            <div
              className={cn(
                "flex h-10 w-10 items-center justify-center rounded-lg text-xs font-bold border",
                colorClasses
              )}
            >
              {logo}
            </div>
            <div className="text-center">
              <p className="text-xs font-medium text-slate-700">
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
