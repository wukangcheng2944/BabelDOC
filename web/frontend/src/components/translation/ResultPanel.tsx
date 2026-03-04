import { motion } from "framer-motion";
import { CheckCircle2, XCircle, Download, FileSpreadsheet } from "lucide-react";
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-xl border p-6 ${
        isSuccess
          ? "border-green-100 bg-green-50/30"
          : "border-red-100 bg-red-50/30"
      }`}
    >
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          {isSuccess ? (
            <CheckCircle2 className="h-5 w-5 text-green-600" />
          ) : (
            <XCircle className="h-5 w-5 text-red-600" />
          )}
          <h3 className="text-sm font-semibold text-slate-900">
            {t("result.title")}
          </h3>
        </div>

        {isSuccess && task.result ? (
          <div className="space-y-3">
            <p className="text-sm text-green-700">{t("result.success")}</p>

            {task.result.totalSeconds > 0 && (
              <p className="text-xs text-slate-500">
                {t("result.duration")}: {task.result.totalSeconds.toFixed(1)} {t("result.seconds")}
              </p>
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
          </div>
        ) : (
          <div className="space-y-3">
            <p className="text-sm text-red-700">{t("result.failed")}</p>
            {task.error && (
              <pre className="rounded-lg bg-red-50 p-3 text-xs text-red-600 overflow-x-auto whitespace-pre-wrap">
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
