import { useState } from "react";
import { Languages, ChevronDown } from "lucide-react";
import { SectionCard } from "@/components/shared/SectionCard";
import { ModelPresetSelector } from "@/components/shared/ModelPresetSelector";
import { ParamRow } from "@/components/shared/ParamRow";
import { ParamSwitch } from "@/components/shared/ParamSwitch";
import { PasswordInput } from "@/components/shared/PasswordInput";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useI18n } from "@/hooks/use-i18n";
import { useConfig } from "@/hooks/use-config";
import { modelPresets } from "@/lib/presets";
import type { ModelPreset } from "@/types/config";
import { cn } from "@/lib/utils";

export function TranslationServiceSection() {
  const { t } = useI18n();
  const { config, setField, dispatch } = useConfig();
  const [advancedOpen, setAdvancedOpen] = useState(false);

  const currentPresetId =
    modelPresets.find(
      (p) => p.model === config.openaiModel && p.baseUrl === config.openaiBaseUrl
    )?.id ?? "custom";

  const handlePresetSelect = (preset: ModelPreset) => {
    dispatch({ type: "APPLY_PRESET", preset });
    if (preset.id !== "custom") {
      // Keep existing API key
    }
  };

  return (
    <SectionCard
      id="service"
      icon={Languages}
      title={t("service.title")}
      defaultOpen={true}
      delay={0.1}
    >
      <div className="space-y-5">
        <div className="space-y-2">
          <Label className="text-xs text-slate-500">{t("service.preset")}</Label>
          <ModelPresetSelector
            selectedId={currentPresetId}
            onSelect={handlePresetSelect}
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label className="text-xs text-slate-500">{t("service.model")}</Label>
            <Input
              value={config.openaiModel}
              onChange={(e) => setField("openaiModel", e.target.value)}
              placeholder={t("service.modelPlaceholder")}
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs text-slate-500">{t("service.apiKey")}</Label>
            <PasswordInput
              value={config.openaiApiKey}
              onChange={(v) => setField("openaiApiKey", v)}
              placeholder={t("service.apiKeyPlaceholder")}
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs text-slate-500">{t("service.baseUrl")}</Label>
          <Input
            value={config.openaiBaseUrl}
            onChange={(e) => setField("openaiBaseUrl", e.target.value)}
            placeholder={t("service.baseUrlPlaceholder")}
          />
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs text-slate-500">{t("service.customPrompt")}</Label>
          <Textarea
            value={config.customSystemPrompt}
            onChange={(e) => setField("customSystemPrompt", e.target.value)}
            placeholder={t("service.customPromptPlaceholder")}
            rows={2}
            className="resize-none"
          />
        </div>

        <Collapsible open={advancedOpen} onOpenChange={setAdvancedOpen}>
          <CollapsibleTrigger className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700 transition-colors">
            <ChevronDown
              className={cn(
                "h-4 w-4 transition-transform duration-200",
                advancedOpen && "rotate-180"
              )}
            />
            {t("service.advancedApi")}
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-3 space-y-2 border-t border-gray-50 pt-3">
            <ParamSwitch
              label={t("service.enableJsonMode")}
              checked={config.enableJsonModeIfRequested}
              onCheckedChange={(v) => setField("enableJsonModeIfRequested", v)}
            />
            <ParamSwitch
              label={t("service.sendDashscopeHeader")}
              checked={config.sendDashscopeHeader}
              onCheckedChange={(v) => setField("sendDashscopeHeader", v)}
            />
            <ParamSwitch
              label={t("service.noSendTemperature")}
              checked={config.noSendTemperature}
              onCheckedChange={(v) => setField("noSendTemperature", v)}
            />
            <ParamRow label={t("service.reasoning")}>
              <Input
                value={config.openaiReasoning}
                onChange={(e) => setField("openaiReasoning", e.target.value)}
                placeholder={t("service.reasoningPlaceholder")}
                className="w-48"
              />
            </ParamRow>
          </CollapsibleContent>
        </Collapsible>
      </div>
    </SectionCard>
  );
}
