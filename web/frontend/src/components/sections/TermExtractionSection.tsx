import { BookOpen } from "lucide-react";
import { BentoCard } from "@/components/shared/BentoCard";
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
    <BentoCard>
      <div className="flex items-center gap-2 mb-3">
        <BookOpen className="h-4 w-4 text-muted-foreground" />
        <h3 className="text-sm font-semibold">{t("termExtraction.title")}</h3>
      </div>
      <div className="space-y-3">
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
          <div className="ml-4 space-y-3 border-l-2 border-primary/30 pl-4">
            <p className="text-xs font-medium text-muted-foreground">
              {t("termExtraction.independentModelConfig")}
            </p>
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">
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
              <Label className="text-xs text-muted-foreground">
                {t("termExtraction.apiKey")}
              </Label>
              <PasswordInput
                value={config.openaiTermExtractionApiKey}
                onChange={(v) => setField("openaiTermExtractionApiKey", v)}
                placeholder="API Key"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">
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
              <Label className="text-xs text-muted-foreground">
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
    </BentoCard>
  );
}
