import { Wrench } from "lucide-react";
import { SectionCard } from "@/components/shared/SectionCard";
import { ParamSwitch } from "@/components/shared/ParamSwitch";
import { useI18n } from "@/hooks/use-i18n";
import { useConfig } from "@/hooks/use-config";

export function AdvancedSection() {
  const { t } = useI18n();
  const { config, setField } = useConfig();

  return (
    <SectionCard
      id="advanced"
      icon={Wrench}
      title={t("advanced.title")}
      defaultOpen={false}
      delay={0.6}
    >
      <div className="space-y-3">
        <ParamSwitch
          label={t("advanced.debug")}
          tooltip={t("advanced.debugDesc")}
          checked={config.debug}
          onCheckedChange={(v) => setField("debug", v)}
        />
        <ParamSwitch
          label={t("advanced.skipTranslation")}
          tooltip={t("advanced.skipTranslationDesc")}
          checked={config.skipTranslation}
          onCheckedChange={(v) => setField("skipTranslation", v)}
        />
        <ParamSwitch
          label={t("advanced.onlyParseGenerate")}
          tooltip={t("advanced.onlyParseGenerateDesc")}
          checked={config.onlyParseGeneratePdf}
          onCheckedChange={(v) => setField("onlyParseGeneratePdf", v)}
        />
        <ParamSwitch
          label={t("advanced.ignoreCache")}
          tooltip={t("advanced.ignoreCacheDesc")}
          checked={config.ignoreCache}
          onCheckedChange={(v) => setField("ignoreCache", v)}
        />
        <ParamSwitch
          label={t("advanced.translateTable")}
          tooltip={t("advanced.translateTableDesc")}
          checked={config.translateTableText}
          onCheckedChange={(v) => setField("translateTableText", v)}
        />
        <ParamSwitch
          label={t("advanced.showCharBox")}
          tooltip={t("advanced.showCharBoxDesc")}
          checked={config.showCharBox}
          onCheckedChange={(v) => setField("showCharBox", v)}
        />
      </div>
    </SectionCard>
  );
}
