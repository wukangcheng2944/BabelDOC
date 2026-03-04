import { useState, useCallback } from "react";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { Footer } from "@/components/layout/Footer";
import { FileUploadSection } from "@/components/sections/FileUploadSection";
import { TranslationServiceSection } from "@/components/sections/TranslationServiceSection";
import { TermExtractionSection } from "@/components/sections/TermExtractionSection";
import { GlossarySection } from "@/components/sections/GlossarySection";
import { OutputFormatSection } from "@/components/sections/OutputFormatSection";
import { PdfProcessingSection } from "@/components/sections/PdfProcessingSection";
import { OcrSection } from "@/components/sections/OcrSection";
import { PerformanceSection } from "@/components/sections/PerformanceSection";
import { AdvancedSection } from "@/components/sections/AdvancedSection";
import { TranslateButton } from "@/components/translation/TranslateButton";
import { ProgressPanel } from "@/components/translation/ProgressPanel";
import { ResultPanel } from "@/components/translation/ResultPanel";
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
  const { config, dispatch, setField } = useConfigReducer();

  // File
  const [file, setFile] = useState<File | null>(null);

  // Glossaries
  const [glossaryFiles, setGlossaryFiles] = useState<GlossaryFile[]>([]);

  // Translation
  const { task, startTranslate, cancelTranslation, reset } = useTranslationTask();

  // Active sidebar section
  const [activeSection, setActiveSection] = useState("file");

  const handleNavigate = useCallback((sectionId: string) => {
    setActiveSection(sectionId);
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, []);

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
    const errors = validateConfig(config, !!file);
    if (errors.length > 0) {
      errors.forEach((err) => {
        toast.error(err.message);
      });
      return;
    }
    if (!file) return;

    const glossaryIds = glossaryFiles.map((g) => g.id);
    startTranslate(file, config, glossaryIds);
  }, [config, file, glossaryFiles, startTranslate]);

  const isTranslating =
    task.status === "uploading" || task.status === "translating";

  return (
    <I18nContext value={i18nValue}>
      <ConfigContext
        value={{ config, dispatch, setField }}
      >
        <TooltipProvider delayDuration={300}>
          <div className="flex min-h-screen flex-col bg-gray-50/80">
            <Header />

            <div className="flex flex-1">
              <Sidebar
                activeSection={activeSection}
                onNavigate={handleNavigate}
              />

              <main className="flex-1 overflow-y-auto">
                <div className="mx-auto max-w-3xl space-y-6 p-6 pb-24">
                  <FileUploadSection
                    file={file}
                    onFileSelect={handleFileSelect}
                    onFileRemove={handleFileRemove}
                  />

                  <TranslationServiceSection />
                  <TermExtractionSection />

                  <GlossarySection
                    glossaryFiles={glossaryFiles}
                    onGlossaryAdd={handleGlossaryAdd}
                    onGlossaryRemove={handleGlossaryRemove}
                  />

                  <OutputFormatSection />
                  <PdfProcessingSection />
                  <OcrSection />
                  <PerformanceSection />
                  <AdvancedSection />

                  <TranslateButton
                    onClick={handleTranslate}
                    disabled={!file || isTranslating}
                    loading={isTranslating}
                  />

                  <ProgressPanel task={task} onCancel={cancelTranslation} />
                  <ResultPanel task={task} onReset={reset} />
                </div>
              </main>
            </div>

            <Footer />
          </div>

          <Toaster position="top-right" />
        </TooltipProvider>
      </ConfigContext>
    </I18nContext>
  );
}
