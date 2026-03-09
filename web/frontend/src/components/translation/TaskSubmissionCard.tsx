import { FileText, ArrowRight, Sparkles } from "lucide-react";
import { BentoCard } from "@/components/shared/BentoCard";
import { FileDropZone } from "@/components/shared/FileDropZone";
import { LanguageCombobox } from "@/components/shared/LanguageCombobox";
import { TranslateButton } from "./TranslateButton";
import { ProgressPanel } from "./ProgressPanel";
import { ResultPanel } from "./ResultPanel";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useI18n } from "@/hooks/use-i18n";
import { useConfig } from "@/hooks/use-config";
import { useTokenEstimate } from "@/hooks/use-token-estimate";
import type { TranslationTask } from "@/types/config";

interface TaskSubmissionCardProps {
  file: File | null;
  onFileSelect: (file: File) => void;
  onFileRemove: () => void;
  onTranslate: () => void;
  translateDisabled: boolean;
  translateLoading: boolean;
  translateHint?: string;
  task: TranslationTask;
  onCancel: () => void;
  onReset: () => void;
}

export function TaskSubmissionCard({
  file,
  onFileSelect,
  onFileRemove,
  onTranslate,
  translateDisabled,
  translateLoading,
  translateHint,
  task,
  onCancel,
  onReset,
}: TaskSubmissionCardProps) {
  const { t } = useI18n();
  const { config, setField } = useConfig();
  const { estimate, loading: estimateLoading } = useTokenEstimate(
    file,
    config.openaiModel
  );

  const formatTokenK = (n: number) =>
    n >= 1000 ? `${(n / 1000).toFixed(1)}k` : String(n);

  return (
    <BentoCard>
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <FileText className="h-4 w-4 text-muted-foreground" />
        <h3 className="text-sm font-semibold">{t("task.title")}</h3>
      </div>

      <div className="space-y-4">
        {/* File Upload */}
        <FileDropZone
          accept=".pdf"
          onFileSelect={onFileSelect}
          selectedFile={file}
          onRemove={onFileRemove}
          label={t("file.upload")}
          hint={t("file.uploadHint")}
        />

        {/* Language Selection */}
        <div className="flex items-center gap-3">
          <div className="flex-1 space-y-1.5">
            <Label className="text-xs text-muted-foreground">
              {t("file.langIn")}
            </Label>
            <LanguageCombobox
              value={config.langIn}
              onChange={(v) => setField("langIn", v)}
            />
          </div>
          <ArrowRight className="mt-5 h-4 w-4 shrink-0 text-muted-foreground/50" />
          <div className="flex-1 space-y-1.5">
            <Label className="text-xs text-muted-foreground">
              {t("file.langOut")}
            </Label>
            <LanguageCombobox
              value={config.langOut}
              onChange={(v) => setField("langOut", v)}
            />
          </div>
        </div>

        {/* Page Range */}
        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground">
            {t("file.pages")}
          </Label>
          <Input
            value={config.pages}
            onChange={(e) => setField("pages", e.target.value)}
            placeholder={t("file.pagesPlaceholder")}
            className="text-sm"
          />
        </div>

        {/* Token Estimate */}
        {file && (
          <>
            <div className="border-t border-border/50" />
            <div>
              <div className="flex items-center gap-1.5 mb-2">
                <Sparkles className="h-3.5 w-3.5 text-primary" />
                <span className="text-xs font-medium text-muted-foreground">
                  {t("estimate.title")}
                </span>
              </div>
              {estimateLoading ? (
                <div className="grid grid-cols-2 gap-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="space-y-1">
                      <div className="h-2.5 w-12 animate-pulse rounded bg-muted" />
                      <div className="h-4 w-16 animate-pulse rounded bg-muted" />
                    </div>
                  ))}
                </div>
              ) : estimate ? (
                <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                  <div>
                    <p className="text-[10px] text-muted-foreground">
                      {t("estimate.model")}
                    </p>
                    <p className="text-xs font-medium truncate">
                      {estimate.model}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] text-muted-foreground">
                      {t("estimate.pages")}
                    </p>
                    <p className="text-xs font-mono font-medium">
                      {estimate.pageCount}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] text-muted-foreground">
                      {t("estimate.tokens")}
                    </p>
                    <p className="text-xs font-mono font-medium">
                      {formatTokenK(estimate.estimatedTokens)}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] text-muted-foreground">
                      {t("estimate.cost")}
                    </p>
                    <p className="text-xs font-mono font-medium">
                      {estimate.estimatedCostUsd != null
                        ? `$${estimate.estimatedCostUsd.toFixed(4)}`
                        : t("estimate.na")}
                    </p>
                  </div>
                </div>
              ) : null}
            </div>
          </>
        )}

        {/* Divider + Translate Button */}
        <div className="border-t border-border/50 pt-1" />
        <TranslateButton
          onClick={onTranslate}
          disabled={translateDisabled}
          loading={translateLoading}
          hint={translateHint}
        />

        {/* Progress & Result */}
        <ProgressPanel task={task} onCancel={onCancel} />
        <ResultPanel task={task} onReset={onReset} />
      </div>
    </BentoCard>
  );
}
