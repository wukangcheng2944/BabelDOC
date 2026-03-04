import { ScanLine } from "lucide-react";
import { SectionCard } from "@/components/shared/SectionCard";
import { ParamSwitch } from "@/components/shared/ParamSwitch";
import { useI18n } from "@/hooks/use-i18n";
import { useConfig } from "@/hooks/use-config";

export function OcrSection() {
  const { t } = useI18n();
  const { config, setField } = useConfig();

  return (
    <SectionCard
      id="ocr"
      icon={ScanLine}
      title={t("ocr.title")}
      defaultOpen={false}
      delay={0.5}
      badge={t("common.experimental")}
      badgeVariant="outline"
    >
      <div className="space-y-3">
        <ParamSwitch
          label={t("ocr.ocrWorkaround")}
          tooltip={t("ocr.ocrWorkaroundDesc")}
          checked={config.ocrWorkaround}
          onCheckedChange={(v) => setField("ocrWorkaround", v)}
        />
        <ParamSwitch
          label={t("ocr.autoEnableOcr")}
          tooltip={t("ocr.autoEnableOcrDesc")}
          checked={config.autoEnableOcrWorkaround}
          onCheckedChange={(v) => setField("autoEnableOcrWorkaround", v)}
        />
        <ParamSwitch
          label={t("ocr.skipScannedDetection")}
          tooltip={t("ocr.skipScannedDetectionDesc")}
          checked={config.skipScannedDetection}
          onCheckedChange={(v) => setField("skipScannedDetection", v)}
          overridden={config.ocrWorkaround}
          overrideLabel={t("common.override")}
        />
      </div>
    </SectionCard>
  );
}
