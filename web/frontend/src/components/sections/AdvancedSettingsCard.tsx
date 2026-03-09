import { Settings2, ScanLine, Wrench } from "lucide-react";
import { BentoCard } from "@/components/shared/BentoCard";
import { ParamRow } from "@/components/shared/ParamRow";
import { ParamSwitch } from "@/components/shared/ParamSwitch";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useI18n } from "@/hooks/use-i18n";
import { useConfig } from "@/hooks/use-config";

export function AdvancedSettingsCard() {
  const { t } = useI18n();
  const { config, setField } = useConfig();

  return (
    <BentoCard className="min-h-[60px]">
      <div className="flex items-center gap-2 mb-2">
        <Settings2 className="h-4 w-4 text-muted-foreground" />
        <h3 className="text-sm font-semibold">{t("advancedSettings.title")}</h3>
      </div>

      <Accordion type="multiple" className="w-full">
        {/* PDF Processing */}
        <AccordionItem value="processing" className="border-border/50">
          <AccordionTrigger className="text-sm hover:no-underline py-3">
            <div className="flex items-center gap-2">
              <Settings2 className="h-3.5 w-3.5 text-muted-foreground" />
              {t("processing.title")}
            </div>
          </AccordionTrigger>
          <AccordionContent>
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
                onCheckedChange={(v) =>
                  setField("mergeAlternatingLineNumbers", v)
                }
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
                      onValueChange={([v]) =>
                        setField("shortLineSplitFactor", v)
                      }
                      min={0}
                      max={1}
                      step={0.05}
                      className="flex-1"
                    />
                    <span className="text-xs text-muted-foreground w-10 text-right">
                      {config.shortLineSplitFactor.toFixed(2)}
                    </span>
                  </div>
                </ParamRow>
              )}
              <ParamRow label={t("processing.minTextLength")}>
                <Input
                  type="number"
                  value={config.minTextLength}
                  onChange={(e) =>
                    setField("minTextLength", parseInt(e.target.value) || 5)
                  }
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
                onCheckedChange={(v) =>
                  setField("enableGraphicElementProcess", v)
                }
              />
              <ParamRow label={t("processing.formulaFontPattern")}>
                <Input
                  value={config.formularFontPattern}
                  onChange={(e) =>
                    setField("formularFontPattern", e.target.value)
                  }
                  placeholder="regex"
                  className="w-48 font-mono text-xs"
                />
              </ParamRow>
              <ParamRow label={t("processing.formulaCharPattern")}>
                <Input
                  value={config.formularCharPattern}
                  onChange={(e) =>
                    setField("formularCharPattern", e.target.value)
                  }
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
                onCheckedChange={(v) =>
                  setField("disableSameTextFallback", v)
                }
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
                      onValueChange={([v]) =>
                        setField("nonFormulaLineIouThreshold", v)
                      }
                      min={0}
                      max={1}
                      step={0.05}
                      className="flex-1"
                    />
                    <span className="text-xs text-muted-foreground w-10 text-right">
                      {config.nonFormulaLineIouThreshold.toFixed(2)}
                    </span>
                  </div>
                </ParamRow>
              )}
              <ParamRow label={t("processing.figureTableProtection")}>
                <div className="flex items-center gap-3 w-48">
                  <Slider
                    value={[config.figureTableProtectionThreshold]}
                    onValueChange={([v]) =>
                      setField("figureTableProtectionThreshold", v)
                    }
                    min={0}
                    max={1}
                    step={0.05}
                    className="flex-1"
                  />
                  <span className="text-xs text-muted-foreground w-10 text-right">
                    {config.figureTableProtectionThreshold.toFixed(2)}
                  </span>
                </div>
              </ParamRow>
              <ParamSwitch
                label={t("processing.skipFormulaOffset")}
                checked={config.skipFormulaOffsetCalculation}
                onCheckedChange={(v) =>
                  setField("skipFormulaOffsetCalculation", v)
                }
              />
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* OCR Settings */}
        <AccordionItem value="ocr" className="border-border/50">
          <AccordionTrigger className="text-sm hover:no-underline py-3">
            <div className="flex items-center gap-2">
              <ScanLine className="h-3.5 w-3.5 text-muted-foreground" />
              {t("ocr.title")}
              <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                {t("common.experimental")}
              </Badge>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-3">
              <ParamSwitch
                label={t("ocr.autoEnableOcr")}
                tooltip={t("ocr.autoEnableOcrDesc")}
                checked={config.autoEnableOcrWorkaround}
                onCheckedChange={(v) =>
                  setField("autoEnableOcrWorkaround", v)
                }
              />
              <ParamSwitch
                label={t("ocr.ocrWorkaround")}
                tooltip={t("ocr.ocrWorkaroundDesc")}
                checked={config.ocrWorkaround}
                onCheckedChange={(v) => setField("ocrWorkaround", v)}
                disabled={config.autoEnableOcrWorkaround}
                overridden={config.autoEnableOcrWorkaround}
                overrideLabel={t("common.override")}
              />
              <ParamSwitch
                label={t("ocr.skipScannedDetection")}
                tooltip={t("ocr.skipScannedDetectionDesc")}
                checked={config.skipScannedDetection}
                onCheckedChange={(v) => setField("skipScannedDetection", v)}
                overridden={
                  config.ocrWorkaround || config.autoEnableOcrWorkaround
                }
                overrideLabel={t("common.override")}
              />
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Debug & Advanced */}
        <AccordionItem value="advanced" className="border-b-0">
          <AccordionTrigger className="text-sm hover:no-underline py-3">
            <div className="flex items-center gap-2">
              <Wrench className="h-3.5 w-3.5 text-muted-foreground" />
              {t("advanced.title")}
            </div>
          </AccordionTrigger>
          <AccordionContent>
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
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </BentoCard>
  );
}
