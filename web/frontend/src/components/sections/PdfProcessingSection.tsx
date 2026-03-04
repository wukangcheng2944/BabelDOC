import { Settings2 } from "lucide-react";
import { SectionCard } from "@/components/shared/SectionCard";
import { ParamRow } from "@/components/shared/ParamRow";
import { ParamSwitch } from "@/components/shared/ParamSwitch";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { useI18n } from "@/hooks/use-i18n";
import { useConfig } from "@/hooks/use-config";

export function PdfProcessingSection() {
  const { t } = useI18n();
  const { config, setField } = useConfig();

  return (
    <SectionCard
      id="processing"
      icon={Settings2}
      title={t("processing.title")}
      defaultOpen={false}
      delay={0.4}
    >
      <div className="space-y-3">
        <ParamSwitch
          label={t("processing.enhanceCompatibility")}
          tooltip={t("processing.enhanceCompatibilityDesc")}
          checked={config.enhanceCompatibility}
          onCheckedChange={(v) => setField("enhanceCompatibility", v)}
        />
        <ParamSwitch
          label={t("processing.skipClean")}
          tooltip={t("processing.skipCleanDesc")}
          checked={config.skipClean}
          onCheckedChange={(v) => setField("skipClean", v)}
          overridden={config.enhanceCompatibility}
          overrideLabel={t("common.override")}
        />
        <ParamSwitch
          label={t("processing.disableRichText")}
          tooltip={t("processing.disableRichTextDesc")}
          checked={config.disableRichTextTranslate}
          onCheckedChange={(v) => setField("disableRichTextTranslate", v)}
          overridden={config.enhanceCompatibility || config.ocrWorkaround}
          overrideLabel={t("common.override")}
        />
        <ParamSwitch
          label={t("processing.mergeLineNumbers")}
          checked={config.mergeAlternatingLineNumbers}
          onCheckedChange={(v) => setField("mergeAlternatingLineNumbers", v)}
        />
        <ParamSwitch
          label={t("processing.splitShortLines")}
          checked={config.splitShortLines}
          onCheckedChange={(v) => setField("splitShortLines", v)}
        />
        {config.splitShortLines && (
          <ParamRow label={t("processing.shortLineFactor")}>
            <div className="flex items-center gap-3 w-48">
              <Slider
                value={[config.shortLineSplitFactor]}
                onValueChange={([v]) => setField("shortLineSplitFactor", v)}
                min={0}
                max={1}
                step={0.05}
                className="flex-1"
              />
              <span className="text-xs text-slate-500 w-10 text-right">
                {config.shortLineSplitFactor.toFixed(2)}
              </span>
            </div>
          </ParamRow>
        )}
        <ParamRow label={t("processing.minTextLength")}>
          <Input
            type="number"
            value={config.minTextLength}
            onChange={(e) => setField("minTextLength", parseInt(e.target.value) || 5)}
            className="w-20 text-center"
            min={1}
            max={100}
          />
        </ParamRow>
        <ParamSwitch
          label={t("processing.skipFormRender")}
          checked={config.skipFormRender}
          onCheckedChange={(v) => setField("skipFormRender", v)}
        />
        <ParamSwitch
          label={t("processing.skipCurveRender")}
          checked={config.skipCurveRender}
          onCheckedChange={(v) => setField("skipCurveRender", v)}
        />
        <ParamSwitch
          label={t("processing.enableGraphicProcess")}
          checked={config.enableGraphicElementProcess}
          onCheckedChange={(v) => setField("enableGraphicElementProcess", v)}
        />
        <ParamRow label={t("processing.formulaFontPattern")}>
          <Input
            value={config.formularFontPattern}
            onChange={(e) => setField("formularFontPattern", e.target.value)}
            placeholder="regex"
            className="w-48 font-mono text-xs"
          />
        </ParamRow>
        <ParamRow label={t("processing.formulaCharPattern")}>
          <Input
            value={config.formularCharPattern}
            onChange={(e) => setField("formularCharPattern", e.target.value)}
            placeholder="regex"
            className="w-48 font-mono text-xs"
          />
        </ParamRow>
        <ParamSwitch
          label={t("processing.addFormulaHint")}
          checked={config.addFormulaPlaceholdHint}
          onCheckedChange={(v) => setField("addFormulaPlaceholdHint", v)}
        />
        <ParamSwitch
          label={t("processing.disableSameTextFallback")}
          checked={config.disableSameTextFallback}
          onCheckedChange={(v) => setField("disableSameTextFallback", v)}
        />
        <ParamSwitch
          label={t("processing.removeNonFormulaLines")}
          checked={config.removeNonFormulaLines}
          onCheckedChange={(v) => setField("removeNonFormulaLines", v)}
          overridden={config.ocrWorkaround}
          overrideLabel={t("common.override")}
        />
        {config.removeNonFormulaLines && (
          <ParamRow label={t("processing.nonFormulaIou")}>
            <div className="flex items-center gap-3 w-48">
              <Slider
                value={[config.nonFormulaLineIouThreshold]}
                onValueChange={([v]) => setField("nonFormulaLineIouThreshold", v)}
                min={0}
                max={1}
                step={0.05}
                className="flex-1"
              />
              <span className="text-xs text-slate-500 w-10 text-right">
                {config.nonFormulaLineIouThreshold.toFixed(2)}
              </span>
            </div>
          </ParamRow>
        )}
        <ParamRow label={t("processing.figureTableProtection")}>
          <div className="flex items-center gap-3 w-48">
            <Slider
              value={[config.figureTableProtectionThreshold]}
              onValueChange={([v]) => setField("figureTableProtectionThreshold", v)}
              min={0}
              max={1}
              step={0.05}
              className="flex-1"
            />
            <span className="text-xs text-slate-500 w-10 text-right">
              {config.figureTableProtectionThreshold.toFixed(2)}
            </span>
          </div>
        </ParamRow>
        <ParamSwitch
          label={t("processing.skipFormulaOffset")}
          checked={config.skipFormulaOffsetCalculation}
          onCheckedChange={(v) => setField("skipFormulaOffsetCalculation", v)}
        />
      </div>
    </SectionCard>
  );
}
