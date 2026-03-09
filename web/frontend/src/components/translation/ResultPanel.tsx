import { motion } from "framer-motion";
import { CheckCircle2, XCircle, Download, FileSpreadsheet, AlertCircle, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/hooks/use-i18n";
import type { TranslationTask } from "@/types/config";

interface ResultPanelProps {
  task: TranslationTask;
  onReset: () => void;
}

export function ResultPanel({ task, onReset }: ResultPanelProps) {
  const { t } = useI18n();

  if (task.status !== "completed" && task.status !== "failed" && task.status !== "cancelled") {
    return null;
  }

  const isSuccess = task.status === "completed";
  const isCancelled = task.status === "cancelled";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-xl border p-6 ${
        isSuccess
          ? "border-green-500/20 bg-green-500/5"
          : isCancelled
            ? "border-amber-500/20 bg-amber-500/5"
            : "border-destructive/20 bg-destructive/5"
      }`}
    >
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          {isSuccess ? (
            <CheckCircle2 className="h-5 w-5 text-green-500" />
          ) : isCancelled ? (
            <AlertCircle className="h-5 w-5 text-amber-500" />
          ) : (
            <XCircle className="h-5 w-5 text-destructive" />
          )}
          <h3 className="text-sm font-semibold text-foreground">
            {t("result.title")}
          </h3>
        </div>

        {isSuccess && task.result ? (
          <div className="space-y-3">
            <p className="text-sm text-green-400">{t("result.success")}</p>

            {task.result.totalSeconds > 0 && (
              <p className="text-xs text-muted-foreground">
                {t("result.duration")}: {task.result.totalSeconds.toFixed(1)} {t("result.seconds")}
              </p>
            )}

            {task.result.resourceUsage && (
              <ResourceUsageInline usage={task.result.resourceUsage} />
            )}

            <div className="flex flex-wrap gap-2">
              {task.result.dualPdfUrl && (
                <Button size="sm" className="gap-2" asChild>
                  <a href={task.result.dualPdfUrl} download>
                    <Download className="h-4 w-4" />
                    {t("result.downloadDual")}
                  </a>
                </Button>
              )}
              {task.result.monoPdfUrl && (
                <Button size="sm" variant="outline" className="gap-2" asChild>
                  <a href={task.result.monoPdfUrl} download>
                    <Download className="h-4 w-4" />
                    {t("result.downloadMono")}
                  </a>
                </Button>
              )}
              {task.result.glossaryUrl && (
                <Button size="sm" variant="outline" className="gap-2" asChild>
                  <a href={task.result.glossaryUrl} download>
                    <FileSpreadsheet className="h-4 w-4" />
                    {t("result.downloadGlossary")}
                  </a>
                </Button>
              )}
            </div>

            <Button variant="outline" size="sm" onClick={onReset} className="gap-2">
              <RotateCcw className="h-4 w-4" />
              {t("result.newTranslation")}
            </Button>
          </div>
        ) : isCancelled ? (
          <div className="space-y-3">
            <p className="text-sm text-amber-400">{t("result.cancelled")}</p>
            <Button variant="outline" size="sm" onClick={onReset} className="gap-2">
              <RotateCcw className="h-4 w-4" />
              {t("result.newTranslation")}
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            <p className="text-sm text-destructive">{t("result.failed")}</p>
            {task.error && (
              <pre className="rounded-lg bg-destructive/10 p-3 text-xs text-destructive overflow-x-auto whitespace-pre-wrap">
                {task.error}
              </pre>
            )}
            <Button variant="outline" size="sm" onClick={onReset}>
              {t("common.reset")}
            </Button>
          </div>
        )}
      </div>
    </motion.div>
  );
}

function ResourceUsageInline({ usage }: { usage: import("@/types/config").ResourceUsage }) {
  const { t } = useI18n();

  const formatNumber = (n: number) => n.toLocaleString();
  const formatTokenK = (n: number) => n >= 1000 ? `${(n / 1000).toFixed(1)}k` : String(n);

  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
      {usage.totalSeconds != null && (
        <div className="rounded-lg bg-muted/50 p-2">
          <p className="text-[10px] text-muted-foreground">{t("resource.duration")}</p>
          <p className="text-sm font-mono font-medium">{usage.totalSeconds.toFixed(1)}s</p>
        </div>
      )}
      {usage.peakMemoryUsage != null && (
        <div className="rounded-lg bg-muted/50 p-2">
          <p className="text-[10px] text-muted-foreground">{t("resource.peakMemory")}</p>
          <p className="text-sm font-mono font-medium">{(usage.peakMemoryUsage / (1024 * 1024 * 1024)).toFixed(2)} GB</p>
        </div>
      )}
      {usage.characterCount != null && (
        <div className="rounded-lg bg-muted/50 p-2">
          <p className="text-[10px] text-muted-foreground">{t("resource.characters")}</p>
          <p className="text-sm font-mono font-medium">{formatNumber(usage.characterCount)}</p>
        </div>
      )}
      {usage.promptTokenCount != null && (
        <div className="rounded-lg bg-muted/50 p-2">
          <p className="text-[10px] text-muted-foreground">{t("resource.promptTokens")}</p>
          <p className="text-sm font-mono font-medium">{formatTokenK(usage.promptTokenCount)}</p>
        </div>
      )}
      {usage.completionTokenCount != null && (
        <div className="rounded-lg bg-muted/50 p-2">
          <p className="text-[10px] text-muted-foreground">{t("resource.completionTokens")}</p>
          <p className="text-sm font-mono font-medium">{formatTokenK(usage.completionTokenCount)}</p>
        </div>
      )}
      {usage.cacheHitTokenCount != null && usage.cacheHitTokenCount > 0 && (
        <div className="rounded-lg bg-muted/50 p-2">
          <p className="text-[10px] text-muted-foreground">{t("resource.cacheHit")}</p>
          <p className="text-sm font-mono font-medium">{formatTokenK(usage.cacheHitTokenCount)}</p>
        </div>
      )}
    </div>
  );
}
