import { useState, useCallback, useEffect } from "react";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { TabBar, type TabId } from "@/components/layout/TabBar";
import { BentoGrid } from "@/components/layout/BentoGrid";
import { TranslationServiceSection } from "@/components/sections/TranslationServiceSection";
import { TermExtractionSection } from "@/components/sections/TermExtractionSection";
import { TermModelConfigCard } from "@/components/sections/TermModelConfigCard";
import { GlossarySection } from "@/components/sections/GlossarySection";
import { OutputFormatSection } from "@/components/sections/OutputFormatSection";
import { AdvancedSettingsCard } from "@/components/sections/AdvancedSettingsCard";
import { PerformanceSection } from "@/components/sections/PerformanceSection";
import { TaskSubmissionCard } from "@/components/translation/TaskSubmissionCard";
import { HistoryTab } from "@/components/history/HistoryTab";
import { I18nContext, createI18nValue } from "@/hooks/use-i18n";
import { ConfigContext, useConfigReducer } from "@/hooks/use-config";
import { useTranslationTask } from "@/hooks/use-translation";
import { validateConfig } from "@/lib/validation";
import { ThemeContext, type Theme, applyTheme, getInitialTheme } from "@/hooks/use-theme";
import type { Locale } from "@/i18n";

interface GlossaryFile {
  id: string;
  name: string;
  size: number;
}

export default function App() {
  // Theme
  const [theme, setThemeState] = useState<Theme>(getInitialTheme);
  const setTheme = useCallback((t: Theme) => {
    setThemeState(t);
    applyTheme(t);
  }, []);
  const toggleTheme = useCallback(() => {
    setTheme(theme === "dark" ? "light" : "dark");
  }, [theme, setTheme]);

  // Apply theme on mount
  useEffect(() => {
    applyTheme(theme);
  }, []);

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
    a.download = "k3-doctranslate-config.json";
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
    <ThemeContext value={{ theme, setTheme, toggleTheme }}>
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
                    {/* Row 1: Task Submission (2col) + Translation Service (4col) */}
                    <div className="md:col-span-1 lg:col-span-2">
                      <TaskSubmissionCard
                        file={file}
                        onFileSelect={handleFileSelect}
                        onFileRemove={handleFileRemove}
                        onTranslate={handleTranslate}
                        translateDisabled={!file || isTranslating}
                        translateLoading={isTranslating}
                        translateHint={translateHint}
                        task={task}
                        onCancel={cancelTranslation}
                        onReset={reset}
                      />
                    </div>

                    <div className="md:col-span-2 lg:col-span-4">
                      <TranslationServiceSection />
                    </div>

                    {/* Row 2: Term Extraction (2col) + Glossary (1col) + Output Format (3col) */}
                    <div className="md:col-span-1 lg:col-span-2">
                      <TermExtractionSection />
                    </div>

                    <div className="md:col-span-1 lg:col-span-1">
                      <GlossarySection
                        glossaryFiles={glossaryFiles}
                        onGlossaryAdd={handleGlossaryAdd}
                        onGlossaryRemove={handleGlossaryRemove}
                      />
                    </div>

                    <div className="md:col-span-1 lg:col-span-3">
                      <OutputFormatSection />
                    </div>

                    {/* Conditional: Independent term model config (3col, under Term + Glossary) */}
                    {config.useIndependentTermModel && (
                      <div className="md:col-span-3 lg:col-span-3">
                        <TermModelConfigCard />
                      </div>
                    )}

                    {/* Row 3: Advanced Settings (4col) + Performance (2col) */}
                    <div className="md:col-span-2 lg:col-span-4">
                      <AdvancedSettingsCard />
                    </div>

                    <div className="md:col-span-1 lg:col-span-2">
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

          <Toaster position="top-right" theme={theme} />
        </TooltipProvider>
      </ConfigContext>
    </I18nContext>
    </ThemeContext>
  );
}
