import { useState, useCallback } from "react";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { TabBar, type TabId } from "@/components/layout/TabBar";
import { BentoGrid } from "@/components/layout/BentoGrid";
import { FileUploadSection } from "@/components/sections/FileUploadSection";
import { TranslationServiceSection } from "@/components/sections/TranslationServiceSection";
import { TermExtractionSection } from "@/components/sections/TermExtractionSection";
import { GlossarySection } from "@/components/sections/GlossarySection";
import { OutputFormatSection } from "@/components/sections/OutputFormatSection";
import { AdvancedSettingsCard } from "@/components/sections/AdvancedSettingsCard";
import { PerformanceSection } from "@/components/sections/PerformanceSection";
import { TranslateButton } from "@/components/translation/TranslateButton";
import { ProgressPanel } from "@/components/translation/ProgressPanel";
import { ResultPanel } from "@/components/translation/ResultPanel";
import { TokenEstimateCard } from "@/components/translation/TokenEstimateCard";
import { HistoryTab } from "@/components/history/HistoryTab";
import { I18nContext, createI18nValue } from "@/hooks/use-i18n";
import { ConfigContext, useConfigReducer } from "@/hooks/use-config";
import { useTranslationTask } from "@/hooks/use-translation";
import { validateConfig } from "@/lib/validation";
import type { Locale } from "@/i18n";

interface GlossaryFile {
  id: string;
  name: string;
  size: number;
}

export default function App() {
  // i18n
  const [locale, setLocale] = useState<Locale>("zh");
  const i18nValue = createI18nValue(locale, setLocale);

  // Config
  const { config, dispatch, setField, activePresetId, presetStorage } =
    useConfigReducer();

  // File
  const [file, setFile] = useState<File | null>(null);

  // Glossaries
  const [glossaryFiles, setGlossaryFiles] = useState<GlossaryFile[]>([]);

  // Translation
  const { task, startTranslate, cancelTranslation, reset } = useTranslationTask();

  // Tab
  const [activeTab, setActiveTab] = useState<TabId>("translate");

  const handleFileSelect = useCallback((f: File) => {
    setFile(f);
  }, []);

  const handleFileRemove = useCallback(() => {
    setFile(null);
  }, []);

  const handleGlossaryAdd = useCallback((gf: GlossaryFile) => {
    setGlossaryFiles((prev) => [...prev, gf]);
  }, []);

  const handleGlossaryRemove = useCallback((id: string) => {
    setGlossaryFiles((prev) => prev.filter((g) => g.id !== id));
  }, []);

  const handleTranslate = useCallback(() => {
    const errors = validateConfig(config, !!file, locale, activePresetId);
    if (errors.length > 0) {
      errors.forEach((err) => {
        toast.error(err.message);
      });
      return;
    }
    if (!file) return;

    const glossaryIds = glossaryFiles.map((g) => g.id);
    startTranslate(file, config, glossaryIds);
  }, [config, file, glossaryFiles, startTranslate, locale, activePresetId]);

  const isTranslating =
    task.status === "uploading" || task.status === "translating";

  const translateHint = !file
    ? i18nValue.t("translate.uploadFirst")
    : undefined;

  // Config import/export
  const handleExportConfig = useCallback(() => {
    const blob = new Blob([JSON.stringify(config, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "babeldoc-config.json";
    a.click();
    URL.revokeObjectURL(url);
    toast.success(i18nValue.t("header.exportSuccess"));
  }, [config, i18nValue]);

  const handleImportConfig = useCallback(() => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";
    input.onchange = (e) => {
      const target = e.target as HTMLInputElement;
      const f = target.files?.[0];
      if (!f) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        try {
          const imported = JSON.parse(ev.target?.result as string);
          dispatch({ type: "IMPORT", config: imported });
          toast.success(i18nValue.t("header.importSuccess"));
        } catch {
          toast.error(i18nValue.t("header.importError"));
        }
      };
      reader.readAsText(f);
    };
    input.click();
  }, [dispatch, i18nValue]);

  return (
    <I18nContext value={i18nValue}>
      <ConfigContext
        value={{ config, dispatch, setField, activePresetId, presetStorage }}
      >
        <TooltipProvider delayDuration={300}>
          <div className="flex min-h-screen flex-col">
            <Header
              onImport={handleImportConfig}
              onExport={handleExportConfig}
            />

            <TabBar activeTab={activeTab} onTabChange={setActiveTab} />

            <main className="flex-1 px-4 pb-8 md:px-6 lg:px-8">
              {activeTab === "translate" ? (
                <div className="mx-auto max-w-7xl">
                  <BentoGrid>
                    {/* Row 1: File Upload (2col×2row) + Translation Service (3col×2row) + Token Estimate (1col×2row) */}
                    <div className="md:col-span-1 lg:col-span-2 lg:row-span-2">
                      <FileUploadSection
                        file={file}
                        onFileSelect={handleFileSelect}
                        onFileRemove={handleFileRemove}
                      />
                    </div>

                    <div className="md:col-span-2 lg:col-span-3 lg:row-span-2">
                      <TranslationServiceSection />
                    </div>

                    <div className="md:col-span-1 lg:col-span-1 lg:row-span-2">
                      <TokenEstimateCard file={file} />
                    </div>

                    {/* Row 2: Term Extraction (1col) + Glossary (1col) + Output Format (2col) + Action Zone (2col) */}
                    <div className="md:col-span-1 lg:col-span-1">
                      <TermExtractionSection />
                    </div>

                    <div className="md:col-span-1 lg:col-span-1">
                      <GlossarySection
                        glossaryFiles={glossaryFiles}
                        onGlossaryAdd={handleGlossaryAdd}
                        onGlossaryRemove={handleGlossaryRemove}
                      />
                    </div>

                    <div className="md:col-span-1 lg:col-span-2">
                      <OutputFormatSection />
                    </div>

                    <div className="md:col-span-3 lg:col-span-2">
                      <div className="space-y-4">
                        <TranslateButton
                          onClick={handleTranslate}
                          disabled={!file || isTranslating}
                          loading={isTranslating}
                          hint={translateHint}
                        />
                        <ProgressPanel task={task} onCancel={cancelTranslation} />
                        <ResultPanel task={task} onReset={reset} />
                      </div>
                    </div>

                    {/* Row 3: Advanced Settings (4col) + Performance (2col) */}
                    <div className="md:col-span-3 lg:col-span-4">
                      <AdvancedSettingsCard />
                    </div>

                    <div className="md:col-span-3 lg:col-span-2">
                      <PerformanceSection />
                    </div>
                  </BentoGrid>
                </div>
              ) : (
                <div className="mx-auto max-w-7xl">
                  <HistoryTab />
                </div>
              )}
            </main>

            <Footer />
          </div>

          <Toaster position="top-right" />
        </TooltipProvider>
      </ConfigContext>
    </I18nContext>
  );
}
