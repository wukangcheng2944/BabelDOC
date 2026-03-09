import { BookOpen } from "lucide-react";
import { BentoCard } from "@/components/shared/BentoCard";
import { ParamSwitch } from "@/components/shared/ParamSwitch";
import { useI18n } from "@/hooks/use-i18n";
import { useConfig } from "@/hooks/use-config";

export function TermExtractionSection() {
  const { t } = useI18n();
  const { config, setField } = useConfig();

  return (
    <BentoCard className="h-full">
      <div className="flex items-center gap-2 mb-2">
        <BookOpen className="h-4 w-4 text-muted-foreground" />
        <h3 className="text-sm font-semibold">{t("termExtraction.title")}</h3>
      </div>
      <div className="space-y-1">
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
      </div>
    </BentoCard>
  );
}
