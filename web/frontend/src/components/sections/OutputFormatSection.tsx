import { FileOutput } from "lucide-react";
import { BentoCard } from "@/components/shared/BentoCard";
import { ParamRow } from "@/components/shared/ParamRow";
import { ParamSwitch } from "@/components/shared/ParamSwitch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useI18n } from "@/hooks/use-i18n";
import { useConfig } from "@/hooks/use-config";
import type { OutputMode, WatermarkOutputMode, PrimaryFontFamily } from "@/types/config";

export function OutputFormatSection() {
  const { t } = useI18n();
  const { config, setField } = useConfig();

  return (
    <BentoCard>
      <div className="flex items-center gap-2 mb-2">
        <FileOutput className="h-4 w-4 text-muted-foreground" />
        <h3 className="text-sm font-semibold">{t("output.title")}</h3>
      </div>
      <div className="space-y-1">
        <ParamRow label={t("output.mode")}>
          <Select
            value={config.outputMode}
            onValueChange={(v) => setField("outputMode", v as OutputMode)}
          >
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="dual_and_mono">{t("output.dualAndMono")}</SelectItem>
              <SelectItem value="dual_only">{t("output.dualOnly")}</SelectItem>
              <SelectItem value="mono_only">{t("output.monoOnly")}</SelectItem>
            </SelectContent>
          </Select>
        </ParamRow>

        <ParamRow label={t("output.watermark")}>
          <Select
            value={config.watermarkOutputMode}
            onValueChange={(v) =>
              setField("watermarkOutputMode", v as WatermarkOutputMode)
            }
          >
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="watermarked">{t("output.watermarked")}</SelectItem>
              <SelectItem value="no_watermark">{t("output.noWatermark")}</SelectItem>
              <SelectItem value="both">{t("output.both")}</SelectItem>
            </SelectContent>
          </Select>
        </ParamRow>

        {config.outputMode !== "mono_only" && (
          <>
            <ParamRow label={t("output.dualMode")}>
              <Select
                value={config.useAlternatingPagesDual ? "alternating" : "side_by_side"}
                onValueChange={(v) =>
                  setField("useAlternatingPagesDual", v === "alternating")
                }
              >
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="side_by_side">{t("output.sideBySide")}</SelectItem>
                  <SelectItem value="alternating">{t("output.alternating")}</SelectItem>
                </SelectContent>
              </Select>
            </ParamRow>

            <ParamSwitch
              label={t("output.dualTranslateFirst")}
              checked={config.dualTranslateFirst}
              onCheckedChange={(v) => setField("dualTranslateFirst", v)}
              overridden={config.enhanceCompatibility}
              overrideLabel={t("common.override")}
            />
          </>
        )}

        <ParamSwitch
          label={t("output.onlyTranslated")}
          checked={config.onlyIncludeTranslatedPage ?? false}
          onCheckedChange={(v) => setField("onlyIncludeTranslatedPage", v)}
        />

        <ParamRow label={t("output.primaryFontFamily")}>
          <Select
            value={config.primaryFontFamily ?? "auto"}
            onValueChange={(v) =>
              setField(
                "primaryFontFamily",
                v === "auto" ? null : (v as PrimaryFontFamily)
              )
            }
          >
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="auto">{t("output.auto")}</SelectItem>
              <SelectItem value="serif">{t("output.serif")}</SelectItem>
              <SelectItem value="sans-serif">{t("output.sansSerif")}</SelectItem>
              <SelectItem value="script">{t("output.script")}</SelectItem>
            </SelectContent>
          </Select>
        </ParamRow>
      </div>
    </BentoCard>
  );
}
