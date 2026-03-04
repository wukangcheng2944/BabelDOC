import { BookOpen } from "lucide-react";
import { SectionCard } from "@/components/shared/SectionCard";
import { ParamSwitch } from "@/components/shared/ParamSwitch";
import { PasswordInput } from "@/components/shared/PasswordInput";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useI18n } from "@/hooks/use-i18n";
import { useConfig } from "@/hooks/use-config";

export function TermExtractionSection() {
  const { t } = useI18n();
  const { config, setField } = useConfig();

  return (
    <SectionCard
      id="term-extraction"
      icon={BookOpen}
      title={t("termExtraction.title")}
      defaultOpen={false}
      delay={0.2}
    >
      <div className="space-y-4">
        <ParamSwitch
          label={t("termExtraction.autoExtract")}
          checked={config.autoExtractGlossary}
          onCheckedChange={(v) => setField("autoExtractGlossary", v)}
        />
        <ParamSwitch
          label={t("termExtraction.saveGlossary")}
          checked={config.saveAutoExtractedGlossary}
          onCheckedChange={(v) => setField("saveAutoExtractedGlossary", v)}
        />
        <ParamSwitch
          label={t("termExtraction.useIndependentModel")}
          checked={config.useIndependentTermModel}
          onCheckedChange={(v) => setField("useIndependentTermModel", v)}
        />

        {config.useIndependentTermModel && (
          <div className="ml-4 space-y-3 border-l-2 border-blue-100 pl-4">
            <p className="text-xs font-medium text-slate-500">
              {t("termExtraction.independentModelConfig")}
            </p>
            <div className="space-y-1.5">
              <Label className="text-xs text-slate-500">
                {t("termExtraction.model")}
              </Label>
              <Input
                value={config.openaiTermExtractionModel}
                onChange={(e) =>
                  setField("openaiTermExtractionModel", e.target.value)
                }
                placeholder={config.openaiModel || "model name"}
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-slate-500">
                {t("termExtraction.apiKey")}
              </Label>
              <PasswordInput
                value={config.openaiTermExtractionApiKey}
                onChange={(v) => setField("openaiTermExtractionApiKey", v)}
                placeholder="API Key"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-slate-500">
                {t("termExtraction.baseUrl")}
              </Label>
              <Input
                value={config.openaiTermExtractionBaseUrl}
                onChange={(e) =>
                  setField("openaiTermExtractionBaseUrl", e.target.value)
                }
                placeholder={config.openaiBaseUrl || "Base URL"}
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-slate-500">
                {t("termExtraction.reasoning")}
              </Label>
              <Input
                value={config.openaiTermExtractionReasoning}
                onChange={(e) =>
                  setField("openaiTermExtractionReasoning", e.target.value)
                }
                placeholder="reasoning"
              />
            </div>
          </div>
        )}
      </div>
    </SectionCard>
  );
}
